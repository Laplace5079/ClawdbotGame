import { create } from 'zustand';
import type { Item } from '../systems/loot.types';
import { StatType } from '../systems/stats.types';
import type { BaseStats } from '../systems/stats.types';

interface DroppedItem {
  item: Item;
  position: [number, number, number];
}

interface GameState {
  // Movement
  targetPos: [number, number, number] | null;
  setTargetPos: (pos: [number, number, number] | null) => void;

  // Player Stats
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  baseStats: BaseStats;
  inventory: Item[];
  equipped: Record<string, Item | null>;
  droppedItems: DroppedItem[];
  
  // VFX
  vfx: { id: string, type: string, position: [number, number, number], createdAt: number }[];
  addVFX: (type: string, position: [number, number, number]) => void;
  removeVFX: (id: string) => void;
  
  // Actions
  addItem: (item: Item) => void;
  equipItem: (item: Item, slot: string) => void;
  dropItem: (item: Item, position: [number, number, number]) => void;
  pickupItem: (id: string) => void;
  // Enemy System
  enemies: EnemyData[];
  spawnEnemy: (enemy: EnemyData) => void;
  damageEnemy: (id: string, damage: number) => void;
  removeEnemy: (id: string) => void;

  // Leveling
  experience: number;
  level: number;
  addExperience: (amount: number) => void;

  // Persistence
  saveGame: () => void;
  loadGame: () => void;
}

export interface EnemyData {
  id: string;
  position: [number, number, number];
  hp: number;
  maxHp: number;
  isBoss?: boolean;
}

export const useStore = create<GameState>((set, get) => ({
  targetPos: null,
  setTargetPos: (pos) => set({ targetPos: pos }),

  playerPos: [0, 0, 0],
  setPlayerPos: (pos) => set({ playerPos: pos }),

  baseStats: {
    [StatType.STRENGTH]: 10,
    [StatType.DEXTERITY]: 10,
    [StatType.INTELLIGENCE]: 10,
    [StatType.VITALITY]: 10,
  },
  inventory: [],
  equipped: {
    weapon: null,
    armor: null,
    ring: null,
  },
  droppedItems: [],
  enemies: [],
  vfx: [],

  // Initial Leveling State
  experience: 0,
  level: 1,

  addExperience: (amount) => set((state) => {
    const newExperience = state.experience + amount;
    const experienceToNextLevel = state.level * 100;
    if (newExperience >= experienceToNextLevel) {
      return {
        experience: newExperience - experienceToNextLevel,
        level: state.level + 1,
        // Buff stats on level up
        baseStats: {
          ...state.baseStats,
          [StatType.VITALITY]: state.baseStats[StatType.VITALITY] + 2,
          [StatType.STRENGTH]: state.baseStats[StatType.STRENGTH] + 1,
        }
      };
    }
    return { experience: newExperience };
  }),

  saveGame: () => {
    const state = get();
    const saveData = {
      baseStats: state.baseStats,
      inventory: state.inventory,
      equipped: state.equipped,
      experience: state.experience,
      level: state.level,
    };
    localStorage.setItem('abyss_save', JSON.stringify(saveData));
    console.log("Game Saved");
  },

  loadGame: () => {
    const saved = localStorage.getItem('abyss_save');
    if (saved) {
      const data = JSON.parse(saved);
      set({ ...data });
      console.log("Game Loaded");
    }
  },

  addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  addVFX: (type, position) => set((state) => ({
    vfx: [...state.vfx, { id: Math.random().toString(), type, position, createdAt: Date.now() }]
  })),
  removeVFX: (id) => set((state) => ({
    vfx: state.vfx.filter(v => v.id !== id)
  })),
  equipItem: (item, slot) => set((state) => ({
    equipped: { ...state.equipped, [slot]: item }
  })),
  dropItem: (item, position) => set((state) => ({
    droppedItems: [...state.droppedItems, { item, position }]
  })),
  pickupItem: (id: string) => set((state) => {
    const dropped = state.droppedItems.find((d) => d.item.id === id);
    if (!dropped) return state;
    return {
      inventory: [...state.inventory, dropped.item],
      droppedItems: state.droppedItems.filter((d) => d.item.id !== id),
    };
  }),

  spawnEnemy: (enemy) => set((state) => ({ enemies: [...state.enemies, enemy] })),
  damageEnemy: (id, damage) => set((state) => ({
    enemies: state.enemies.map(e => e.id === id ? { ...e, hp: Math.max(0, e.hp - damage) } : e)
  })),
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id)
  })),
}));
