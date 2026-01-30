const StatType = {
  STRENGTH: 'strength',
  DEXTERITY: 'dexterity',
  INTELLIGENCE: 'intelligence',
  VITALITY: 'vitality',
} as const;
type StatType = (typeof StatType)[keyof typeof StatType];

const DerivedStatType = {
  MAX_HP: 'maxHp',
  MAX_MANA: 'maxMana',
  PHYSICAL_DAMAGE: 'physicalDamage',
  ATTACK_SPEED: 'attackSpeed',
  CRIT_CHANCE: 'critChance',
  MOVE_SPEED: 'moveSpeed',
} as const;
type DerivedStatType = (typeof DerivedStatType)[keyof typeof DerivedStatType];

const ModifierType = {
  FLAT: 'flat',
  PERCENT_INCREASED: 'percent_increased',
  PERCENT_MORE: 'percent_more',
} as const;
type ModifierType = (typeof ModifierType)[keyof typeof ModifierType];

export { StatType, DerivedStatType, ModifierType };

export interface Modifier {
  id: string;
  stat: StatType | DerivedStatType;
  type: ModifierType;
  value: number;
  source: string; // e.g., 'base', 'item_id', 'buff_id'
}

export interface BaseStats {
  [StatType.STRENGTH]: number;
  [StatType.DEXTERITY]: number;
  [StatType.INTELLIGENCE]: number;
  [StatType.VITALITY]: number;
}

export interface ComputedStats {
  [DerivedStatType.MAX_HP]: number;
  [DerivedStatType.MAX_MANA]: number;
  [DerivedStatType.PHYSICAL_DAMAGE]: number;
  [DerivedStatType.ATTACK_SPEED]: number;
  [DerivedStatType.CRIT_CHANCE]: number;
  [DerivedStatType.MOVE_SPEED]: number;
}
