import { EntityType, LevelConfig } from './types';

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;

export const GRAVITY = 0.1; // Base gravity
export const FRICTION = 0.99;
export const BLADE_LIFETIME = 15; // Frames
export const BLADE_COLOR = '#FFFFFF';
export const BLADE_WIDTH = 6;

export const INITIAL_LIVES = 3;
export const FRENZY_DURATION = 400; // Increased to ~6.5 seconds for Bonus Round
export const FRENZY_CHARGE_MAX = 100;
export const FRENZY_CHARGE_PER_SLICE = 4;
export const FRENZY_CHARGE_PER_COMBO = 10;

// 8-bit Color Palette (Dark Theme Adjusted)
export const COLORS = {
  apple: '#FF6B6B',
  orange: '#FFB347',
  watermelon: '#77DD77',
  grape: '#9370DB',
  pineapple: '#FFD700',
  cherry: '#DC143C',
  issySpecial: '#DDA0DD',
  bomb: '#404040', 
  freeze: '#AEC6CF',
  frenzy: '#FFFF00',
  juice: {
    [EntityType.FRUIT_APPLE]: '#FF6B6B',
    [EntityType.FRUIT_ORANGE]: '#FFB347',
    [EntityType.FRUIT_WATERMELON]: '#77DD77',
    [EntityType.FRUIT_GRAPE]: '#9370DB',
    [EntityType.FRUIT_PINEAPPLE]: '#F4C430',
    [EntityType.FRUIT_CHERRY]: '#DC143C',
    [EntityType.FRUIT_ISSY_SPECIAL]: '#FF69B4',
    [EntityType.BOMB]: '#888888', 
    [EntityType.POWERUP_FREEZE]: '#AEC6CF',
    [EntityType.POWERUP_FRENZY]: '#FFFFE0',
  }
};

export const SPAWN_RATES = {
  minInterval: 40, // Frames
  maxInterval: 100,
  bombChance: 0.15,
  specialChance: 0.05
};

// Adjusted radii for Scale 6 (approx 1.5x bigger than before)
export const ENTITY_CONFIG = {
  [EntityType.FRUIT_APPLE]: { radius: 45, score: 10 },
  [EntityType.FRUIT_ORANGE]: { radius: 45, score: 15 },
  [EntityType.FRUIT_WATERMELON]: { radius: 55, score: 20 },
  [EntityType.FRUIT_GRAPE]: { radius: 40, score: 25 },
  [EntityType.FRUIT_PINEAPPLE]: { radius: 50, score: 30 },
  [EntityType.FRUIT_CHERRY]: { radius: 35, score: 40 }, 
  [EntityType.FRUIT_ISSY_SPECIAL]: { radius: 60, score: 100 }, 
  [EntityType.BOMB]: { radius: 50, score: 0 },
  [EntityType.POWERUP_FREEZE]: { radius: 40, score: 0 },
  [EntityType.POWERUP_FRENZY]: { radius: 45, score: 0 },
};

// Increased spawnIntervals for slower pacing
export const LEVELS: LevelConfig[] = [
  { 
    threshold: 0, 
    spawnInterval: 90, 
    bombChance: 0, 
    allowedTypes: [EntityType.FRUIT_APPLE, EntityType.FRUIT_ORANGE],
    name: "WARM UP" 
  },
  { 
    threshold: 100, 
    spawnInterval: 80, 
    bombChance: 0.1, 
    allowedTypes: [EntityType.FRUIT_APPLE, EntityType.FRUIT_ORANGE, EntityType.FRUIT_GRAPE],
    name: "GETTING JUICY" 
  },
  { 
    threshold: 300, 
    spawnInterval: 70, 
    bombChance: 0.15, 
    allowedTypes: [EntityType.FRUIT_APPLE, EntityType.FRUIT_GRAPE, EntityType.FRUIT_WATERMELON, EntityType.FRUIT_PINEAPPLE],
    name: "TROPICAL MIX"
  },
  { 
    threshold: 600, 
    spawnInterval: 60, 
    bombChance: 0.2, 
    allowedTypes: [EntityType.FRUIT_APPLE, EntityType.FRUIT_ORANGE, EntityType.FRUIT_WATERMELON, EntityType.FRUIT_CHERRY, EntityType.BOMB],
    name: "DANGER ZONE"
  },
  { 
    threshold: 1000, 
    spawnInterval: 50, 
    bombChance: 0.25, 
    allowedTypes: [
      EntityType.FRUIT_APPLE, EntityType.FRUIT_ORANGE, EntityType.FRUIT_WATERMELON, 
      EntityType.FRUIT_GRAPE, EntityType.FRUIT_PINEAPPLE, EntityType.FRUIT_CHERRY,
      EntityType.BOMB, EntityType.FRUIT_ISSY_SPECIAL, EntityType.POWERUP_FRENZY
    ],
    name: "ISSY MANIA"
  }
];