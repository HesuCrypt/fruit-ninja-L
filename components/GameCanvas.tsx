import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    GameState,
    GameEntity,
    EntityType,
    TrailPoint,
    Particle,
    ScoreConfig,
    SlicedPart,
    GameSettings,
    FloatingText
} from '../types';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    GRAVITY,
    BLADE_LIFETIME,
    COLORS,
    ENTITY_CONFIG,
    LEVELS,
    FRENZY_DURATION,
    FRENZY_CHARGE_MAX,
    FRENZY_CHARGE_PER_SLICE,
    FRENZY_CHARGE_PER_COMBO
} from '../constants';
import {
    spawnEntity,
    lineIntersectsCircle,
    createExplosion,
    createSlicedParts,
    drawSprite,
    generateId,
    randomRange
} from '../utils/gameUtils';
import { soundEngine } from '../utils/soundEngine';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

interface GameCanvasProps {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    onScoreUpdate: (score: ScoreConfig) => void;
    gameMode: any;
    settings: GameSettings;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, onScoreUpdate, settings }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // Game State Refs
    const entitiesRef = useRef<GameEntity[]>([]);
    const slicedPartsRef = useRef<SlicedPart[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const trailRef = useRef<TrailPoint[]>([]);
    const floatingTextsRef = useRef<FloatingText[]>([]);

    const scoreRef = useRef<number>(0);
    const scoreMaskRef = useRef<number>(0); // Anti-memory-hack mask
    const integrityRef = useRef<number>(0); // Checksum

    const livesRef = useRef<number>(3);
    const comboRef = useRef<{ count: number, timer: number }>({ count: 0, timer: 0 });
    const timeRef = useRef<number>(0);
    const difficultyRef = useRef<number>(1);
    const spawnTimerRef = useRef<number>(0);
    const currentLevelRef = useRef<number>(1);

    // Frenzy Mode Ref
    const frenzyTimerRef = useRef<number>(0);
    const frenzyChargeRef = useRef<number>(0); // 0 to 100

    // Leaderboard Data
    const leaderboardScoresRef = useRef<number[]>([]);
    const nextTargetScoreRef = useRef<number | null>(null);

    // Effects Refs
    const shakeRef = useRef<number>(0);
    const [flashActive, setFlashActive] = useState(false);
    const [whiteoutActive, setWhiteoutActive] = useState(false);
    const [levelUpData, setLevelUpData] = useState<{ show: boolean, name: string }>({ show: false, name: '' });

    // Input tracking
    const isDraggingRef = useRef<boolean>(false);
    const lastMousePosRef = useRef<{ x: number, y: number } | null>(null);
    const isGameOverProcessing = useRef<boolean>(false);

    // Helper to generate a simple integrity token
    const generateToken = useCallback((score: number, lives: number, time: number) => {
        // Very simple obfuscated hash (not crypto secure but stops basic scripts)
        const secret = "issy-fruit-salt-2024";
        const str = `${score}-${lives}-${time}-${secret}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash.toString(36);
    }, []);

    const updateScore = useCallback((amount: number) => {
        // Obfuscated update
        const trueScore = scoreRef.current ^ scoreMaskRef.current;
        const newScore = trueScore + amount;
        scoreRef.current = newScore ^ scoreMaskRef.current;

        // Update checksum
        integrityRef.current = (integrityRef.current + amount) ^ 0xAF;
    }, []);

    // --- LEADERBOARD FETCHING ---
    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!isSupabaseConfigured()) return;
            try {
                const { data, error } = await supabase
                    .from('leaderboard')
                    .select('score')
                    .order('score', { ascending: false })
                    .limit(50);

                if (!error && data) {
                    // Store unique scores sorted descending
                    const scores = Array.from(new Set((data as any[]).map((d: any) => Number(d.score)))).sort((a: number, b: number) => b - a);
                    leaderboardScoresRef.current = scores;
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard targets", err);
            }
        };

        if (gameState === GameState.INTRO || gameState === GameState.MENU) {
            fetchLeaderboard();
        }
    }, [gameState]);

    // Determine next target score based on current score
    const updateNextTarget = useCallback(() => {
        const current = scoreRef.current ^ scoreMaskRef.current;
        const scores = leaderboardScoresRef.current;

        // Find the smallest score that is strictly greater than current
        let target: number | null = null;

        // Look for the next rank above us
        for (let i = scores.length - 1; i >= 0; i--) {
            if (scores[i] > current) {
                target = scores[i];
                break;
            }
        }

        nextTargetScoreRef.current = target;
    }, []);

    const resetGame = useCallback(() => {
        entitiesRef.current = [];
        slicedPartsRef.current = [];
        particlesRef.current = [];
        trailRef.current = [];
        floatingTextsRef.current = [];

        // Reset score with new random mask
        scoreMaskRef.current = Math.floor(Math.random() * 0xFFFFFF);
        scoreRef.current = 0 ^ scoreMaskRef.current;
        integrityRef.current = 0;

        livesRef.current = 3;
        comboRef.current = { count: 0, timer: 0 };
        timeRef.current = 0;
        difficultyRef.current = 1;
        shakeRef.current = 0;
        currentLevelRef.current = 1;
        frenzyTimerRef.current = 0;
        frenzyChargeRef.current = 0;
        isGameOverProcessing.current = false;

        // Ensure overlays are cleared
        setWhiteoutActive(false);
        setFlashActive(false);

        updateNextTarget();

        onScoreUpdate({
            score: 0,
            highScore: 0,
            combo: 0,
            lives: 3,
            level: 1,
            isFrenzy: false,
            frenzyProgress: 0,
            nextTargetScore: nextTargetScoreRef.current,
            validationToken: generateToken(0, 3, 0)
        });
        soundEngine.init();
    }, [onScoreUpdate, updateNextTarget, generateToken]);

    const update = useCallback(() => {
        if (gameState !== GameState.PLAYING) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;

        // 1. Screen Shake & Clear
        ctx.save();
        if (settings.screenShake && shakeRef.current > 0) {
            const dx = (Math.random() - 0.5) * shakeRef.current * 2;
            const dy = (Math.random() - 0.5) * shakeRef.current * 2;
            ctx.translate(dx, dy);
            shakeRef.current *= 0.9;
            if (shakeRef.current < 0.5) shakeRef.current = 0;
        }
        ctx.clearRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);

        // Draw Frenzy Background Overlay
        if (frenzyTimerRef.current > 0) {
            // Rainbow or gold pulse
            const pulse = Math.sin(timeRef.current * 0.1) * 0.1 + 0.1;
            ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`; // Gold
            ctx.fillRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);

            // Decrement Frenzy
            frenzyTimerRef.current--;

            // If frenzy just ended
            if (frenzyTimerRef.current === 0) {
                frenzyChargeRef.current = 0; // Reset charge
                const currentScore = scoreRef.current ^ scoreMaskRef.current;
                onScoreUpdate({
                    score: currentScore,
                    highScore: 0,
                    combo: comboRef.current.count,
                    lives: livesRef.current,
                    level: currentLevelRef.current,
                    isFrenzy: false,
                    frenzyProgress: 0,
                    nextTargetScore: nextTargetScoreRef.current,
                    validationToken: generateToken(currentScore, livesRef.current, timeRef.current)
                });
            }
        }

        // 2. Logic Update
        timeRef.current++;
        difficultyRef.current = 1 + Math.floor(timeRef.current / 600) * 0.1;

        // Level Logic
        let newLevel = 1;
        const currentScore = scoreRef.current ^ scoreMaskRef.current;
        for (let i = 0; i < LEVELS.length; i++) {
            if (currentScore >= LEVELS[i].threshold) {
                newLevel = i + 1;
            }
        }

        if (newLevel !== currentLevelRef.current) {
            const isLevelUp = newLevel > currentLevelRef.current;
            currentLevelRef.current = newLevel;

            if (isLevelUp) {
                soundEngine.playLevelUp();
                setFlashActive(true);
                const levelName = LEVELS[Math.min(newLevel - 1, LEVELS.length - 1)].name;
                setLevelUpData({ show: true, name: levelName });

                setTimeout(() => setFlashActive(false), 200);
                setTimeout(() => setLevelUpData({ show: false, name: '' }), 2500);
            }
        }

        // Determine config to pass to HUD every frame
        const isFrenzy = frenzyTimerRef.current > 0;
        const progress = isFrenzy
            ? frenzyTimerRef.current / FRENZY_DURATION
            : frenzyChargeRef.current / FRENZY_CHARGE_MAX;

        if (timeRef.current % 3 === 0) {
            const currentScore = scoreRef.current ^ scoreMaskRef.current;
            onScoreUpdate({
                score: currentScore,
                highScore: 0,
                combo: comboRef.current.count,
                lives: livesRef.current,
                level: currentLevelRef.current,
                isFrenzy: isFrenzy,
                frenzyProgress: progress,
                nextTargetScore: nextTargetScoreRef.current,
                validationToken: generateToken(currentScore, livesRef.current, timeRef.current)
            });
        }

        const levelConfig = LEVELS[currentLevelRef.current - 1] || LEVELS[LEVELS.length - 1];

        // Combo Timer
        if (comboRef.current.timer > 0) {
            comboRef.current.timer--;
            if (comboRef.current.timer === 0) {
                comboRef.current.count = 0;
            }
        }

        // Spawning
        spawnTimerRef.current++;
        let spawnRate = levelConfig.spawnInterval;

        // Spawn rate logic
        if (frenzyTimerRef.current > 0) {
            spawnRate = 12; // Very fast in bonus round
        } else {
            spawnRate = Math.max(25, spawnRate - (difficultyRef.current * 2));
        }

        if (spawnTimerRef.current > spawnRate) {
            spawnTimerRef.current = 0;
            // isFrenzy parameter ensures no bombs spawn
            const ent = spawnEntity(currentLevelRef.current, difficultyRef.current, frenzyTimerRef.current > 0);
            entitiesRef.current.push(ent);
            if (frenzyTimerRef.current > 0 || Math.random() > 0.7) soundEngine.playThrow();
        }

        const gravityMultiplier = 1 + (currentLevelRef.current * 0.15);

        // Update Entities
        entitiesRef.current.forEach(entity => {
            entity.x += entity.vx;
            entity.y += entity.vy;
            entity.vy += GRAVITY * gravityMultiplier;
            entity.rotation += entity.rotationSpeed;

            if (entity.type === EntityType.POWERUP_FRENZY) {
                entity.scale = 6 + Math.sin(timeRef.current * 0.2) * 1;
            }
        });

        const missedFruits = entitiesRef.current.filter(e =>
            e.y > CANVAS_HEIGHT + 100 &&
            e.type !== EntityType.BOMB &&
            e.type !== EntityType.POWERUP_FREEZE &&
            e.type !== EntityType.POWERUP_FRENZY
        );

        if (missedFruits.length > 0) {
            // Prevent heart loss in Frenzy mode
            if (frenzyTimerRef.current <= 0) {
                livesRef.current -= missedFruits.length;
                comboRef.current.count = 0;

                if (livesRef.current <= 0) {
                    soundEngine.playExplosion();
                    setGameState(GameState.GAME_OVER);
                }
            }
        }
        // Update Parts
        const gravityBase = GRAVITY * gravityMultiplier;
        slicedPartsRef.current.forEach(part => {
            part.x += part.vx;
            part.y += part.vy;
            part.vy += gravityBase * 1.2;
            part.rotation += part.rotationSpeed;
        });

        // Update Particles
        const pGravity = GRAVITY * 0.5;
        particlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity ?? pGravity;
            p.vx *= p.drag ?? 1;
            p.vy *= p.drag ?? 1;
            p.life -= p.isDroplet ? 0.008 : 0.02;
        });

        // Update Floating Texts
        floatingTextsRef.current.forEach(ft => {
            ft.x += ft.vx;
            ft.y += ft.vy;
            ft.vy *= 0.95;
            ft.life -= 0.015;
        });

        // Update Trail
        trailRef.current.forEach(p => p.life--);

        // Cleanup
        // CRITICAL: Entities MUST be filtered every frame, otherwise missedFruits will subtract lives 
        // for several frames before the entity is removed!
        entitiesRef.current = entitiesRef.current.filter(e => e.y <= CANVAS_HEIGHT + 100);

        // Visual-only elements can be batched every 10 frames for performance
        if (timeRef.current % 10 === 0) {
            slicedPartsRef.current = slicedPartsRef.current.filter(p => p.y <= CANVAS_HEIGHT + 100);
            particlesRef.current = particlesRef.current.filter(p => p.life > 0);
            floatingTextsRef.current = floatingTextsRef.current.filter(ft => ft.life > 0);
            trailRef.current = trailRef.current.filter(p => p.life > 0);
        }

        // 3. Render

        entitiesRef.current.forEach(entity => {
            drawSprite(ctx, entity.type, entity.x, entity.y, entity.rotation, entity.scale, 'full');
        });

        ctx.save();
        const shimmerIntensity = 10 + Math.sin(timeRef.current * 0.15) * 5;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = shimmerIntensity;

        slicedPartsRef.current.forEach(part => {
            drawSprite(ctx, part.type, part.x, part.y, part.rotation, part.scale, part.side);
        });
        ctx.restore();

        if (trailRef.current.length > 1) {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            const trailColor = frenzyTimerRef.current > 0
                ? `hsl(${(timeRef.current * 10) % 360}, 100%, 50%)`
                : '#FF69B4';

            ctx.shadowBlur = 10;
            ctx.shadowColor = trailColor;

            ctx.beginPath();
            for (let i = 0; i < trailRef.current.length - 1; i++) {
                const p1 = trailRef.current[i];
                const p2 = trailRef.current[i + 1];
                ctx.lineWidth = (p1.life / BLADE_LIFETIME) * 12;
                ctx.strokeStyle = frenzyTimerRef.current > 0
                    ? trailColor
                    : `rgba(255, 255, 255, ${p1.life / BLADE_LIFETIME})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
        }

        particlesRef.current.forEach(p => {
            ctx.fillStyle = p.color;
            const size = p.size * p.life;
            if (p.isDroplet) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(p.x, p.y, size, size);
            }
        });

        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        floatingTextsRef.current.forEach(ft => {
            ctx.save();
            ctx.globalAlpha = ft.life;
            const scale = ft.life > 0.8 ? 1 + (1 - ft.life) : 1;
            ctx.translate(ft.x, ft.y);
            ctx.scale(scale, scale);
            ctx.fillStyle = ft.color;
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.font = `${ft.size}px "Press Start 2P"`;
            ctx.fillText(ft.text, 0, 0);
            ctx.restore();
        });

        ctx.restore();
        requestRef.current = requestAnimationFrame(update);
    }, [gameState, setGameState, onScoreUpdate, settings, updateNextTarget, generateToken]);

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const handleInput = useCallback((rawX: number, rawY: number) => {
        // Stop processing input if game is over processing or effectively over
        if (gameState !== GameState.PLAYING || isGameOverProcessing.current) return;

        const { x, y } = getCanvasCoordinates(rawX, rawY);

        trailRef.current.push({ x, y, life: BLADE_LIFETIME });

        if (lastMousePosRef.current) {
            const p1 = lastMousePosRef.current;
            const p2 = { x, y };
            let hitCount = 0;
            let hitBomb = false;

            for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
                const entity = entitiesRef.current[i];

                if (lineIntersectsCircle(p1, p2, { x: entity.x, y: entity.y, radius: entity.radius })) {
                    // Bomb Logic
                    if (entity.type === EntityType.BOMB) {
                        hitBomb = true;
                        isGameOverProcessing.current = true; // Block further input

                        entitiesRef.current.splice(i, 1);
                        createExplosion(entity.x, entity.y, '#555', 40).forEach(p => particlesRef.current.push(p));
                        shakeRef.current = 40;
                        soundEngine.playExplosion();
                        setWhiteoutActive(true);

                        // Reduced delay to 200ms to ensure it doesn't feel stuck
                        setTimeout(() => {
                            setWhiteoutActive(false);
                            setGameState(GameState.GAME_OVER);
                        }, 200);
                        break;
                    }

                    // Hit Logic
                    hitCount++;
                    entitiesRef.current.splice(i, 1);
                    const parts = createSlicedParts(entity);
                    slicedPartsRef.current.push(...parts);

                    comboRef.current.count++;
                    comboRef.current.timer = 60;

                    // --- FRENZY BAR CHARGE LOGIC ---
                    // If not currently in frenzy, charge up
                    if (frenzyTimerRef.current <= 0) {
                        let chargeAmount = FRENZY_CHARGE_PER_SLICE;
                        // Combo bonus for bar
                        if (comboRef.current.count > 2) {
                            chargeAmount += FRENZY_CHARGE_PER_COMBO;
                        }

                        // Banana fills completely
                        if (entity.type === EntityType.POWERUP_FRENZY) {
                            chargeAmount = FRENZY_CHARGE_MAX;
                        }

                        frenzyChargeRef.current = Math.min(FRENZY_CHARGE_MAX, frenzyChargeRef.current + chargeAmount);

                        // Check for Full Charge -> Trigger Frenzy
                        if (frenzyChargeRef.current >= FRENZY_CHARGE_MAX) {
                            frenzyTimerRef.current = FRENZY_DURATION;

                            // Floating Text for Bonus Round
                            floatingTextsRef.current.push({
                                id: generateId(),
                                x: CANVAS_WIDTH / 2,
                                y: CANVAS_HEIGHT / 2,
                                text: "BONUS ROUND!",
                                color: "#FFFF00",
                                life: 1.5,
                                size: 30,
                                vx: 0,
                                vy: -1
                            });

                            soundEngine.playCombo(5);
                            soundEngine.playLevelUp(); // Extra sound for frenzy start
                        }
                    } else if (entity.type === EntityType.POWERUP_FRENZY) {
                        // If already in frenzy, extend it
                        frenzyTimerRef.current = FRENZY_DURATION;
                    }

                    const multiplier = Math.max(1, 1 + Math.floor((comboRef.current.count - 1) / 3));
                    let baseScore = ENTITY_CONFIG[entity.type].score;
                    if (frenzyTimerRef.current > 0) baseScore *= 2;

                    const finalScore = baseScore * multiplier;
                    updateScore(finalScore);

                    // Check ranking
                    updateNextTarget();

                    const isCrit = multiplier > 1;
                    floatingTextsRef.current.push({
                        id: generateId(),
                        x: entity.x,
                        y: entity.y - 20,
                        text: `+${finalScore}`,
                        color: isCrit ? '#FFD700' : '#FFF',
                        life: 1.0,
                        size: isCrit ? 20 : 16,
                        vx: randomRange(-1, 1),
                        vy: -2
                    });

                    if (comboRef.current.count >= 3 && settings.showCombo) {
                        const textSize = Math.min(40, 20 + comboRef.current.count * 2);
                        floatingTextsRef.current.push({
                            id: generateId(),
                            x: entity.x,
                            y: entity.y - 50,
                            text: `${comboRef.current.count}x COMBO!`,
                            color: '#77DD77',
                            life: 1.0,
                            size: textSize,
                            vx: 0,
                            vy: -3
                        });
                    }

                    const juiceColor = COLORS.juice[entity.type];
                    const particleCount = settings.highQualityParticles ? 12 : 6;
                    createExplosion(entity.x, entity.y, juiceColor, particleCount).forEach(p => particlesRef.current.push(p));

                    if (comboRef.current.count > 1) {
                        soundEngine.playCombo(comboRef.current.count);
                    } else {
                        soundEngine.playSlice();
                    }
                }
            }
        }
        lastMousePosRef.current = { x, y };
    }, [setGameState, settings, updateNextTarget, gameState]);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        handleInput(e.clientX, e.clientY);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        soundEngine.init();
        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
        lastMousePosRef.current = { x, y };
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
        lastMousePosRef.current = null;
        trailRef.current = [];
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            handleInput(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        isDraggingRef.current = true;
        soundEngine.init();
        if (e.touches.length > 0) {
            const { x, y } = getCanvasCoordinates(e.touches[0].clientX, e.touches[0].clientY);
            lastMousePosRef.current = { x, y };
        }
    };

    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            // Reset only if we are starting a fresh game logic, or if lives/score indicate fresh start
            if (livesRef.current <= 0 || (scoreRef.current === 0 && timeRef.current === 0)) {
                resetGame();
            }
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, update, resetGame]);

    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block w-full h-full bg-issy-cream border-4 border-white/20 rounded-lg shadow-[0px_0px_20px_0px_rgba(255,255,255,0.1)] cursor-crosshair object-cover"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onMouseUp}
                style={{
                    imageRendering: 'pixelated',
                    touchAction: 'none'
                }}
            />

            {/* Level Up Flash (Z-20) */}
            <div
                className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ease-out z-20 ${flashActive ? 'opacity-30' : 'opacity-0'}`}
            />

            {/* Bomb Whiteout Flash (Z-40: Below GameOver's Z-50) */}
            <div
                className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-75 ease-out z-40 ${whiteoutActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {levelUpData.show && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none animate-bounce-in">
                    <h2 className="text-4xl sm:text-6xl text-issy-pastelGreen font-retro drop-shadow-[4px_4px_0_#FFF] animate-pulse">
                        LEVEL UP!
                    </h2>
                    <p className="mt-4 text-xl sm:text-2xl text-white font-retro drop-shadow-[2px_2px_0_#000]">
                        {levelUpData.name}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GameCanvas;