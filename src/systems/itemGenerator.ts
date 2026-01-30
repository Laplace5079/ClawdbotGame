import { ItemRarity, ItemType } from './loot.types';
import type { Item } from './loot.types';
import { StatType, DerivedStatType, ModifierType } from './stats.types';
import { v4 as uuidv4 } from 'uuid';

const ITEM_NAMES: Record<ItemType, string[]> = {
  [ItemType.WEAPON]: ['Slayer', 'Bane', 'Edge', 'Stick', 'Reaver'],
  [ItemType.ARMOR]: ['Plate', 'Leather', 'Robes', 'Guard', 'Vestment'],
  [ItemType.JEWELRY]: ['Ring', 'Amulet', 'Talisman', 'Band', 'Loop'],
};

const STAT_POOL = [
  StatType.STRENGTH, StatType.DEXTERITY, StatType.INTELLIGENCE, StatType.VITALITY,
  DerivedStatType.MAX_HP, DerivedStatType.PHYSICAL_DAMAGE, DerivedStatType.ATTACK_SPEED
];

export const generateItem = (level: number): Item => {
  const rarityRoll = Math.random();
  let rarity: ItemRarity = ItemRarity.COMMON;
  let affixCount = 0;

  if (rarityRoll > 0.98) { rarity = ItemRarity.UNIQUE; affixCount = 4; }
  else if (rarityRoll > 0.90) { rarity = ItemRarity.RARE; affixCount = 3; }
  else if (rarityRoll > 0.7) { rarity = ItemRarity.MAGIC; affixCount = 1; }

  const type = Object.values(ItemType)[Math.floor(Math.random() * 3)];
  const nameBase = ITEM_NAMES[type][Math.floor(Math.random() * ITEM_NAMES[type].length)];
  
  const stats = [];
  const usedStats = new Set();

  for (let i = 0; i < affixCount; i++) {
    let stat;
    do {
      stat = STAT_POOL[Math.floor(Math.random() * STAT_POOL.length)];
    } while (usedStats.has(stat));
    
    usedStats.add(stat);
    const isPercent = Math.random() > 0.7;
    const value = isPercent 
      ? Math.floor(Math.random() * 10 + level) 
      : Math.floor(Math.random() * 5 + level * 2);

    const id = uuidv4();
    stats.push({
      id,
      stat,
      type: isPercent ? ModifierType.PERCENT_INCREASED : ModifierType.FLAT,
      value,
      source: 'item'
    });
  }

  return {
    id: uuidv4(),
    name: `${rarity} ${nameBase}`,
    type,
    rarity,
    level,
    stats
  };
};
