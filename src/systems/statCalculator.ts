import { StatType, DerivedStatType, ModifierType } from './stats.types';
import type { Modifier, BaseStats, ComputedStats } from './stats.types';

export const calculateStats = (base: BaseStats, modifiers: Modifier[]): ComputedStats => {
  const getSum = (stat: StatType | DerivedStatType, type: ModifierType) => 
    modifiers.filter(m => m.stat === stat && m.type === type).reduce((acc, m) => acc + m.value, 0);

  const getMultiplier = (stat: StatType | DerivedStatType) => {
    const inc = getSum(stat, ModifierType.PERCENT_INCREASED);
    const more = modifiers.filter(m => m.stat === stat && m.type === ModifierType.PERCENT_MORE);
    let moreMult = 1;
    more.forEach(m => moreMult *= (1 + m.value / 100));
    return (1 + inc / 100) * moreMult;
  };

  const getFinalValue = (baseVal: number, stat: StatType | DerivedStatType) => {
    const flat = getSum(stat, ModifierType.FLAT);
    return (baseVal + flat) * getMultiplier(stat);
  };

  // 1. Resolve Core Stats first
  const str = getFinalValue(base[StatType.STRENGTH], StatType.STRENGTH);
  const dex = getFinalValue(base[StatType.DEXTERITY], StatType.DEXTERITY);
  const int = getFinalValue(base[StatType.INTELLIGENCE], StatType.INTELLIGENCE);
  const vit = getFinalValue(base[StatType.VITALITY], StatType.VITALITY);

  // 2. Define Base Derived Values (incorporating Core Stats)
  const baseHp = vit * 12; // Adjusted from 10 for better survivability
  const baseMana = int * 8; // Adjusted from 5 for deeper mana pool
  const basePhys = str * 0.7; // Adjusted from 0.5 for punchier combat
  const baseAtkSpeed = 1 + (dex * 0.012); // Dexterity now scales AS faster (0.012 vs 0.01)
  const baseCrit = 5 + (dex * 0.15); // Dexterity now scales Crit faster (0.15 vs 0.1)
  const baseMoveSpeed = 6; // Base move speed increased from 5 to 6 for better game feel

  return {
    [DerivedStatType.MAX_HP]: getFinalValue(baseHp, DerivedStatType.MAX_HP),
    [DerivedStatType.MAX_MANA]: getFinalValue(baseMana, DerivedStatType.MAX_MANA),
    [DerivedStatType.PHYSICAL_DAMAGE]: getFinalValue(basePhys, DerivedStatType.PHYSICAL_DAMAGE),
    [DerivedStatType.ATTACK_SPEED]: getFinalValue(baseAtkSpeed, DerivedStatType.ATTACK_SPEED),
    [DerivedStatType.CRIT_CHANCE]: getFinalValue(baseCrit, DerivedStatType.CRIT_CHANCE),
    [DerivedStatType.MOVE_SPEED]: getFinalValue(baseMoveSpeed, DerivedStatType.MOVE_SPEED),
  };
};
