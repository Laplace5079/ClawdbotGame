import { create } from 'zustand';
import type { Item } from '../systems/loot.types';
import { StatType } from '../systems/stats.types';
import type { BaseStats } from '../systems/stats.types';

interface GameState {
  // Movement
  targetPos: [number, number, number] | null;
  setTargetPos: (pos: [number, number, number] | null) => void;

  // Player Stats
  baseStats: BaseStats;
  inventory: Item[];
  equipped: Record<string, Item | null>;
  
  // Actions
  addItem: (item: Item) => void;
  equipItem: (item: Item, slot: string) => void;
}

export const useStore = create<GameState>((set) => ({
  targetPos: null,
  setTargetPos: (pos) => set({ targetPos: pos }),

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

  addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  equipItem: (item, slot) => set((state) => ({
    equipped: { ...state.equipped, [slot]: item }
  })),
}));
