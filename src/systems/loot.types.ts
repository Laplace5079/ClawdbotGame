import type { Modifier } from './stats.types';

const ItemRarity = {
  COMMON: 'Common',
  MAGIC: 'Magic',
  RARE: 'Rare',
  UNIQUE: 'Unique',
} as const;
type ItemRarity = (typeof ItemRarity)[keyof typeof ItemRarity];

const ItemType = {
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  JEWELRY: 'Jewelry',
} as const;
type ItemType = (typeof ItemType)[keyof typeof ItemType];

export { ItemRarity, ItemType };

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  stats: Modifier[];
}
