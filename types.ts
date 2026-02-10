export enum GameState {
  LOADING,
  INTRO,
  MENU,
  PLAYING,
  PAUSED,
  GAME_OVER,
  LEADERBOARD
}

export enum GameMode {
  CLASSIC,
  ZEN,
  ARCADE
}

export enum EntityType {
  FRUIT_APPLE,
  FRUIT_ORANGE,
  FRUIT_WATERMELON,
  FRUIT_GRAPE,
  FRUIT_PINEAPPLE,
  FRUIT_CHERRY,
  FRUIT_ISSY_SPECIAL,
  BOMB,
  POWERUP_FREEZE,
  POWERUP_FRENZY
}

export interface GameSettings {
  soundEnabled: boolean;
  screenShake: boolean;
  highQualityParticles: boolean;
  showCombo: boolean;
  showLevel: boolean;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
  // Physics extensions
  drag?: number;
  gravity?: number;
  isDroplet?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 0 to 1
  size: number;
  vx: number;
  vy: number;
}

export interface GameEntity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  radius: number;
  scale: number;
  zIndex: number;
}

export interface SlicedPart {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  side: 'left' | 'right';
  scale: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

export interface ScoreConfig {
  score: number;
  highScore: number;
  combo: number;
  lives: number;
  level: number;
  isFrenzy: boolean;
  frenzyProgress: number; // 0 to 1 (Charge or Duration remaining)
  nextTargetScore: number | null; // Score to beat for next rank
}

export type SpriteMap = number[][];

export interface LevelConfig {
  threshold: number;
  spawnInterval: number;
  bombChance: number;
  allowedTypes: EntityType[];
  name: string;
}

export interface LeaderboardEntry {
  id?: number;
  username: string;
  score: number;
  created_at?: string;
}