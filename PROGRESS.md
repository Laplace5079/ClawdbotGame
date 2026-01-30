# Project Abyss Progress Tracking

## Milestone 1: Initialization
- [x] Project initialized with Vite/React/TS
- [x] Three.js, R3F, Rapier, Zustand installed
- [x] Folder structure created
- [x] Base Layout Setup
- [x] Core Logic Drafting (Movement & Physics)

## Milestone 2: Loot & Stats
- [x] Stat system types defined (Base & Derived)
- [x] Stat calculator logic implemented (Flat/Inc/More)
- [x] Loot generation system (Rarity, Affixes, Types)
- [x] Zustand store updated for Inventory/Equipment
- [x] Inventory UI Implementation
- [x] World Loot Labels
- [x] Mock enemy death trigger to spawn loot labels
- [x] Phase 2 Bugfixes (TypeScript & Prop Naming)

## Milestone 3: Procedural Generation & Enemy AI
- [x] Simple grid-based dungeon generator (`dungeonGenerator.ts`)
- [x] Modular Dungeon tile component (`Dungeon.tsx`)
- [x] Enemy System with Zustand state (HP, damage, spawning)
- [x] Basic Melee Enemy AI (Chases player position)
- [x] Stat-linked Combat (Enemy takes damage based on Player's Physical Damage stat)
- [x] Loot drop on Enemy Death (Integration of Phase 2 loot system with Phase 3 enemies)

## Milestone 4: AAA Visual Polish & VFX
- [x] Post-processing stack setup (`@react-three/postprocessing`)
- [x] Bloom, SSAO, Noise, and Vignette implementation
- [x] Exponential fog and grim-dark color palette
- [x] Dynamic flickering torch point lights in dungeon rooms
- [x] Particle-based Hit Impact VFX system
- [x] Integrated VFX triggers into combat loop

