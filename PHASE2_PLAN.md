# Phase 2: Loot, Stats, and Inventory Systems

## 1. RPG Core Logic
- **Stat System:** Implement Base Stats (STR, DEX, INT) and Derived Stats (HP, Mana, DMG, Speed).
- **Modifier Engine:** Support for Flat and Percentage bonuses (e.g., "+10 Strength", "20% Increased Physical Damage").

## 2. Item System
- **Rarity Levels:** Common, Magic, Rare, Unique.
- **Item Types:** Weapons (Sword, Bow, Wand), Armor (Helmet, Chest, Boots), Jewelry.
- **Affix Generation:** Scriptable system to roll random properties based on item level and rarity.

## 3. Inventory UI
- **Backend:** Zustand store to track items, equipped slots, and gold.
- **Frontend:** Simple UI overlay to display current equipment and stash.

## 4. Loot Drops
- **Logic:** Trigger drop on enemy death (mock for now).
- **Visuals:** 3D loot labels in the world with click-to-pickup functionality.
