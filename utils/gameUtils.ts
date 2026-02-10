import { Vector2, GameEntity, EntityType, Particle, SlicedPart, LevelConfig } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ENTITY_CONFIG, COLORS, LEVELS } from '../constants';
import { getCachedSprite } from './pixelSprites';

// Math Helpers
export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Collision Detection
export const lineIntersectsCircle = (
  p1: Vector2,
  p2: Vector2,
  circle: { x: number; y: number; radius: number }
): boolean => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lenSq = dx * dx + dy * dy;
  const t = ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / lenSq;
  let closestX, closestY;
  if (t < 0) { closestX = p1.x; closestY = p1.y; } 
  else if (t > 1) { closestX = p2.x; closestY = p2.y; } 
  else { closestX = p1.x + t * dx; closestY = p1.y + t * dy; }
  const distSq = (circle.x - closestX) ** 2 + (circle.y - closestY) ** 2;
  return distSq < circle.radius * circle.radius;
};

// Spawning Logic with Levels
export const spawnEntity = (level: number, difficultyMultiplier: number, isFrenzy: boolean): GameEntity => {
  const config = LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  // In Frenzy mode, no bombs, high chance of fruits
  const isBomb = isFrenzy ? false : Math.random() < config.bombChance;
  
  // Powerups logic
  const canSpawnSpecial = config.allowedTypes.includes(EntityType.FRUIT_ISSY_SPECIAL);
  const canSpawnFrenzy = config.allowedTypes.includes(EntityType.POWERUP_FRENZY) && !isFrenzy; 

  const isSpecial = !isBomb && canSpawnSpecial && Math.random() < 0.05;
  const isFrenzyPowerup = !isBomb && !isSpecial && canSpawnFrenzy && Math.random() < 0.03; 
  
  let type: EntityType;

  if (isBomb) {
    type = EntityType.BOMB;
  } else if (isSpecial) {
    type = EntityType.FRUIT_ISSY_SPECIAL;
  } else if (isFrenzyPowerup) {
    type = EntityType.POWERUP_FRENZY;
  } else {
    const fruits = config.allowedTypes.filter(t => 
        t !== EntityType.BOMB && 
        t !== EntityType.FRUIT_ISSY_SPECIAL && 
        t !== EntityType.POWERUP_FRENZY
    );
    if (fruits.length === 0) type = EntityType.FRUIT_APPLE;
    else type = fruits[Math.floor(Math.random() * fruits.length)];
  }

  // --- OPTIMIZED TRAJECTORY LOGIC ---
  const padding = 100; 
  const x = randomRange(padding, CANVAS_WIDTH - padding);
  const y = CANVAS_HEIGHT + 60;
  
  // Dynamic Speed:
  // As levels increase, we need to throw harder because gravity will be stronger.
  // Base velocity -13 to -16.
  // Add a level multiplier to velocity.
  
  const levelSpeedMod = 1 + (level * 0.08); // 8% speed increase per level
  const vyBoost = isFrenzy ? 2.5 : 0;
  
  const baseVy = randomRange(-13, -16);
  const yVelocity = (baseVy * levelSpeedMod) - vyBoost;

  // Calculate bias towards center
  const distFromCenter = CANVAS_WIDTH / 2 - x;
  // Increase Horizontal speed slightly with level too
  const centerBias = distFromCenter * randomRange(0.004, 0.007); 
  
  const vxSpread = (isFrenzy ? 1.5 : 0.8) * levelSpeedMod;
  const xVelocity = centerBias + randomRange(-vxSpread, vxSpread);

  return {
    id: generateId(),
    type,
    x,
    y,
    vx: xVelocity,
    vy: yVelocity,
    rotation: 0,
    rotationSpeed: randomRange(-0.15, 0.15), 
    radius: ENTITY_CONFIG[type].radius,
    scale: 6, // BIGGER FRUITS (Was 4)
    zIndex: Math.floor(Math.random() * 10)
  };
};

export const createSlicedParts = (entity: GameEntity): SlicedPart[] => {
    const speed = 3.5; 
    return [
        {
            id: generateId(),
            type: entity.type,
            x: entity.x - 12,
            y: entity.y,
            vx: entity.vx - speed,
            vy: entity.vy, 
            rotation: entity.rotation,
            rotationSpeed: -0.2,
            side: 'left',
            scale: entity.scale
        },
        {
            id: generateId(),
            type: entity.type,
            x: entity.x + 12,
            y: entity.y,
            vx: entity.vx + speed,
            vy: entity.vy, 
            rotation: entity.rotation,
            rotationSpeed: 0.2,
            side: 'right',
            scale: entity.scale
        }
    ];
};

export const createExplosion = (x: number, y: number, color: string, count: number = 10): Particle[] => {
  const particles: Particle[] = [];
  
  // Create a mix of "Sparks" and "Juice Droplets"
  for (let i = 0; i < count; i++) {
    const isDroplet = Math.random() > 0.4; // 60% chance for juice
    const angle = randomRange(0, Math.PI * 2);
    
    // Droplets are slower, heavier, and linger
    // Sparks are fast, light, and vanish quickly
    const speed = isDroplet ? randomRange(2, 6) : randomRange(5, 12);
    
    particles.push({
      id: generateId(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color,
      life: isDroplet ? randomRange(1.2, 1.8) : randomRange(0.5, 0.8),
      size: isDroplet ? randomRange(4, 8) : randomRange(3, 5),
      // Physics properties
      isDroplet,
      drag: isDroplet ? 0.96 : 0.90, // Droplets have drag (air resistance)
      gravity: isDroplet ? 0.3 : 0.1, // Droplets fall, sparks float more
    });
  }
  return particles;
};

// OPTIMIZED SPRITE RENDERING
export const drawSprite = (
    ctx: CanvasRenderingContext2D, 
    type: EntityType, 
    x: number, 
    y: number, 
    rotation: number, 
    scale: number,
    side: 'full' | 'left' | 'right' = 'full'
) => {
    const cachedCanvas = getCachedSprite(type, side);
    
    ctx.save();
    // Round to nearest integer for pixel-perfect rendering
    ctx.translate(Math.floor(x), Math.floor(y));
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    // Draw cached canvas centered
    // Since original map is 12x12, we offset by -6, -6
    ctx.drawImage(cachedCanvas, -6, -6);
    
    ctx.restore();
};