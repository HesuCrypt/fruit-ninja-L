import React, { useState, useEffect } from 'react';
import { RotateCcw, Home, Save, Loader, Instagram } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient';
import { soundEngine } from '../../utils/soundEngine';

interface GameOverProps {
    score: number;
    validationToken?: string;
    onRestart: () => void;
    onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, validationToken, onRestart, onHome }) => {
    // Load stored username, ensure it doesn't have @ for the state (we add it in UI)
    const [username, setUsername] = useState(() => {
        const stored = localStorage.getItem('issy_username') || '';
        return stored.startsWith('@') ? stored.substring(1) : stored;
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    useEffect(() => {
        soundEngine.playGameOverTune();

        // Auto-save if username exists
        if (username.trim() && isSupabaseConfigured()) {
            handleSubmitScore(true);
        }
    }, []);

    const handleSubmitScore = async (isAuto = false) => {
        if (!isAuto) soundEngine.playClick();

        // Anti-hack: Check for token
        if (!validationToken) {
            console.warn("Score rejected: Missing validation token.");
            return;
        }

        // Rate limiting: 2 seconds between manual attempts
        const now = Date.now();
        if (!isAuto && now - lastSubmitTime < 2000) return;
        setLastSubmitTime(now);

        if (!username.trim() || !isSupabaseConfigured() || isSubmitting || submitted) return;

        setIsSubmitting(true);
        try {
            // Save name for next time
            localStorage.setItem('issy_username', username);

            // Add @ for display in leaderboard if not present
            const displayUsername = username.startsWith('@') ? username : `@${username}`;

            // Check if user already exists
            const { data: existingEntries, error: fetchError } = await supabase
                .from('leaderboard')
                .select('score')
                .eq('username', displayUsername);

            if (fetchError) throw fetchError;

            if (existingEntries && existingEntries.length > 0) {
                // User exists, find the highest score they have
                const highestExisting = Math.max(...existingEntries.map(e => e.score));

                if (score > highestExisting) {
                    // Only update if current score is better
                    const { error: updateError } = await supabase
                        .from('leaderboard')
                        .insert([{ username: displayUsername, score: score }]);

                    if (updateError) throw updateError;
                    setSubmitted(true);
                    soundEngine.playLevelUp();
                } else {
                    // Score is lower or equal, just mark as submitted
                    setSubmitted(true);
                }
            } else {
                // New user, insert
                const { error: insertError } = await supabase
                    .from('leaderboard')
                    .insert([{ username: displayUsername, score: score }]);

                if (insertError) throw insertError;
                setSubmitted(true);
                soundEngine.playLevelUp();
            }
        } catch (err) {
            console.error("Error submitting score:", err);
            if (!isAuto) alert("Could not save score. Check connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleHome = () => {
        soundEngine.playClick();
        onHome();
    }

    const handleRestart = () => {
        soundEngine.playClick();
        onRestart();
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 font-retro text-white backdrop-blur-sm p-4">
            <h2 className="text-4xl text-issy-accent mb-4 drop-shadow-[4px_4px_0_#FFF]">GAME OVER</h2>

            <div className="bg-issy-darkCard text-white p-6 border-4 border-issy-pink shadow-[8px_8px_0_0_#FFC0CB] mb-8 text-center rounded w-full max-w-sm">
                <p className="text-sm mb-2 uppercase text-gray-400">Final Score</p>
                <p className="text-5xl mb-6 text-white drop-shadow-[2px_2px_0_#FF69B4]">{score}</p>

                {/* Leaderboard Submission */}
                {isSupabaseConfigured() && !submitted ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-issy-pastelBlue mb-1">
                            <Instagram className="w-3 h-3" />
                            <span>SUBMIT SCORE AS:</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center bg-black border-2 border-white/50 px-2 focus-within:border-issy-pink transition-colors">
                                <span className="text-gray-500 mr-1">@</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toUpperCase().slice(0, 15))}
                                    placeholder="USERNAME"
                                    className="w-full bg-transparent p-2 text-center text-white placeholder-gray-700 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSubmitScore}
                                disabled={isSubmitting || !username}
                                className="bg-issy-pastelGreen text-black p-2 border-2 border-white hover:brightness-110 disabled:opacity-50 min-w-[50px] flex items-center justify-center"
                            >
                                {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                ) : submitted ? (
                    <div className="text-xs bg-gray-800 p-2 border-2 border-green-500 text-green-400 flex items-center justify-center gap-2">
                        <span>SCORE SUBMITTED!</span>
                    </div>
                ) : (
                    <div className="text-xs text-gray-600">
                        LEADERBOARD OFFLINE
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleHome}
                    className="p-4 bg-gray-800 border-4 border-white shadow-[4px_4px_0_0_#FFF] hover:bg-gray-700 transition-colors"
                >
                    <Home className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={handleRestart}
                    className="group relative px-8 py-4 bg-issy-pastelGreen border-4 border-white shadow-[4px_4px_0_0_#FFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    <div className="flex items-center justify-center gap-2 text-black font-bold">
                        <RotateCcw className="w-6 h-6" />
                        <span>TRY AGAIN</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default GameOver;