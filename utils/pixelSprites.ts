import { EntityType, SpriteMap } from '../types';

// 0: Empty
// 1: Outline (White/Grey)
// 2: Main Body
// 3: Highlight/Light
// 4: Detail (Stem, Seeds, Face)

const APPLE_MAP: SpriteMap = [
    [0,0,0,0,0,4,4,0,0,0,0,0],
    [0,0,0,0,0,4,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,2,2,3,2,2,1,0,0,0],
    [0,1,2,2,3,3,3,2,2,1,0,0],
    [0,1,2,2,3,3,2,2,2,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,1,0,0],
    [0,0,1,1,1,1,1,1,1,0,0,0],
];

const ORANGE_MAP: SpriteMap = [
    [0,0,0,0,0,4,4,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,2,2,2,2,2,1,0,0,0],
    [0,1,2,2,3,3,2,2,2,1,0,0],
    [0,1,2,3,3,2,2,2,2,1,0,0],
    [1,2,2,3,2,2,2,4,4,2,1,0],
    [1,2,2,2,2,2,2,4,4,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,2,2,2,1,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
];

const WATERMELON_MAP: SpriteMap = [
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,2,2,4,2,2,1,0,0,0],
    [0,1,2,4,2,2,2,2,2,1,0,0],
    [0,1,2,2,2,2,4,2,2,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,4,2,2,4,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [0,1,3,3,3,3,3,3,3,1,0,0],
    [0,1,4,4,4,4,4,4,4,1,0,0],
    [0,0,1,4,4,4,4,4,1,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
];

const GRAPE_MAP: SpriteMap = [
    [0,0,0,0,0,4,4,0,0,0,0,0],
    [0,0,0,1,1,4,1,1,0,0,0,0],
    [0,0,1,2,2,1,2,2,1,0,0,0],
    [0,1,2,3,2,1,2,2,2,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [0,1,2,2,2,1,2,2,2,1,0,0],
    [0,0,1,2,2,1,2,2,1,0,0,0],
    [0,0,0,1,2,2,2,1,0,0,0,0],
    [0,0,0,0,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
];

const PINEAPPLE_MAP: SpriteMap = [
    [0,0,0,0,1,4,1,0,0,0,0,0],
    [0,0,0,1,4,4,4,1,0,0,0,0],
    [0,0,1,4,4,4,4,4,1,0,0,0],
    [0,1,2,2,3,2,2,2,2,1,0,0],
    [0,1,2,3,2,3,2,3,2,1,0,0],
    [1,2,3,2,3,2,3,2,2,2,1,0],
    [1,2,2,3,2,3,2,3,2,2,1,0],
    [1,2,2,2,3,2,3,2,2,2,1,0],
    [1,2,2,2,2,3,2,2,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,2,2,2,1,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
];

const CHERRY_MAP: SpriteMap = [
    [0,0,0,0,0,0,0,0,0,0,4,0],
    [0,0,0,0,0,0,0,0,0,4,0,0],
    [0,0,0,0,4,4,4,4,4,0,0,0],
    [0,0,0,4,0,0,0,0,0,4,0,0],
    [0,0,4,0,0,0,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,1,2,2,2,1],
    [1,2,2,2,1,0,1,2,3,2,2,1],
    [1,2,3,2,1,0,1,2,2,2,2,1],
    [1,2,2,2,1,0,1,2,2,2,2,1],
    [0,1,2,1,0,0,0,1,2,2,1,0],
    [0,0,1,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
];

const BANANA_MAP: SpriteMap = [ // Used for Frenzy Powerup
    [0,0,0,0,0,0,4,4,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,2,2,1,0,0,0,0],
    [0,0,0,1,2,2,2,1,0,0,0,0],
    [0,0,1,2,3,2,2,1,0,0,0,0],
    [0,1,2,2,2,2,1,0,0,0,0,0],
    [1,2,2,2,2,1,0,0,0,0,0,0],
    [1,2,2,2,1,0,0,0,0,0,0,0],
    [1,2,2,2,1,0,0,0,0,0,0,0],
    [0,1,2,2,1,0,0,0,0,0,0,0],
    [0,0,1,4,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0],
];

// Made Bomb Rounder and Bulkier
const BOMB_MAP: SpriteMap = [
    [0,0,0,0,0,0,3,3,0,0,0,0],
    [0,0,0,0,0,0,4,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,1,1,2,2,2,2,1,1,0,0],
    [0,1,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,4,4,2,2,4,4,2,2,1], // Eyes
    [1,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,4,4,2,2,2,2,1], // Mouth line
    [0,1,2,2,2,2,2,2,2,2,1,0],
    [0,0,1,1,2,2,2,2,1,1,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0],
];

const ISSY_MAP: SpriteMap = [
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,2,2,2,2,2,1,0,0,0],
    [0,1,2,3,2,3,2,3,2,1,0,0],
    [1,2,2,3,2,3,2,3,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,4,4,4,4,4,2,2,1,0],
    [1,2,2,4,4,4,4,4,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,2,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,2,2,2,1,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
];

export const SPRITES = {
    [EntityType.FRUIT_APPLE]: APPLE_MAP,
    [EntityType.FRUIT_ORANGE]: ORANGE_MAP,
    [EntityType.FRUIT_WATERMELON]: WATERMELON_MAP,
    [EntityType.FRUIT_GRAPE]: GRAPE_MAP,
    [EntityType.FRUIT_PINEAPPLE]: PINEAPPLE_MAP,
    [EntityType.FRUIT_CHERRY]: CHERRY_MAP,
    [EntityType.BOMB]: BOMB_MAP,
    [EntityType.FRUIT_ISSY_SPECIAL]: ISSY_MAP,
    [EntityType.POWERUP_FREEZE]: ISSY_MAP, 
    [EntityType.POWERUP_FRENZY]: BANANA_MAP,
};

export const SPRITE_PALETTES = {
    [EntityType.FRUIT_APPLE]: { 1: '#FFF', 2: '#FF6B6B', 3: '#FFC0CB', 4: '#77DD77' }, 
    [EntityType.FRUIT_ORANGE]: { 1: '#FFF', 2: '#FFB347', 3: '#FFE4B5', 4: '#FF8C00' }, 
    [EntityType.FRUIT_WATERMELON]: { 1: '#FFF', 2: '#FF6B6B', 3: '#FFF', 4: '#77DD77' },
    [EntityType.FRUIT_GRAPE]: { 1: '#FFF', 2: '#9370DB', 3: '#E6E6FA', 4: '#77DD77' }, // Purple
    [EntityType.FRUIT_PINEAPPLE]: { 1: '#FFF', 2: '#F4C430', 3: '#FFFFE0', 4: '#228B22' }, // Gold/Green
    [EntityType.FRUIT_CHERRY]: { 1: '#FFF', 2: '#DC143C', 3: '#FFB6C1', 4: '#8B4513' }, // Red/Brown
    [EntityType.BOMB]: { 1: '#FFF', 2: '#404040', 3: '#FF4444', 4: '#111' }, // Darker, Red Fuse
    [EntityType.FRUIT_ISSY_SPECIAL]: { 1: '#FFF', 2: '#FF69B4', 3: '#FFC0CB', 4: '#FFFFFF' }, 
    [EntityType.POWERUP_FREEZE]: { 1: '#FFF', 2: '#AEC6CF', 3: '#E0FFFF', 4: '#FFFFFF' },
    [EntityType.POWERUP_FRENZY]: { 1: '#FFF', 2: '#FFD700', 3: '#FFFFE0', 4: '#8B4513' }, // Bright Yellow
};

// --- CACHING SYSTEM ---
const spriteCache: Record<string, HTMLCanvasElement> = {};

export const getCachedSprite = (type: EntityType, side: 'full' | 'left' | 'right'): HTMLCanvasElement => {
    const key = `${type}-${side}`;
    if (spriteCache[key]) return spriteCache[key];

    const spriteMap = SPRITES[type] || SPRITES[EntityType.FRUIT_APPLE];
    const palette = SPRITE_PALETTES[type] || SPRITE_PALETTES[EntityType.FRUIT_APPLE];

    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        const rows = spriteMap.length;
        const cols = spriteMap[0].length;
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const pixelVal = spriteMap[r][c];
                if (pixelVal === 0) continue;

                // Slicing Check
                if (side === 'left' && c >= cols / 2) continue;
                if (side === 'right' && c < cols / 2) continue;

                ctx.fillStyle = palette[pixelVal as keyof typeof palette] || '#FFF';
                ctx.fillRect(c, r, 1, 1);
            }
        }
    }

    spriteCache[key] = canvas;
    return canvas;
};