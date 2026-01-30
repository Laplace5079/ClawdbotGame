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
  baseStats: BaseStats;
  inventory: Item[];
  equipped: Record<string, Item | null>;
  droppedItems: DroppedItem[];
  
  // Actions
  addItem: (item: Item) => void;
  equipItem: (item: Item, slot: string) => void;
  dropItem: (item: Item, position: [number, number, number]) => void;
  pickupItem: (id: string) => void;
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
  droppedItems: [],

  addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  equipItem: (item, slot) => set((state) => ({
    equipped: { ...state.equipped, [slot]: item }
  })),
  dropItem: (item, position) => set((state) => ({
    droppedItems: [...state.droppedItems, { item, position }]
  })),
  pickupItem: (id) => set((state) => {
    const dropped = state.droppedItems.find((d) => d.item.id === id);
    if (!dropped) return state;
    return {
      inventory: [...state.inventory, dropped.item],
      droppedItems: state.droppedItems.filter((d) => d.item.id !== id),
    };
  }),
}));
