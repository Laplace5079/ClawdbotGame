# Phase 3: Procedural World, Enemies, and Combat Polish

## 1. Procedural Dungeon Generation
- **Generator:** Implement a Graph-based or Cellular Automata dungeon builder.
- **NavMesh:** Ensure real-time pathfinding works on generated layouts.
- **Environment:** Swap the flat ground for modular tiles (Stone, Dirt, Corridors).

## 2. Enemy System
- **Types:** Melee Grunt, Ranged Archer, Elite Boss.
- **AI:** Simple state machine (Patrol -> Chase -> Attack).
- **Combat Loop:** Real-time damage application based on stats.

## 3. AAA Visual Polish
- **Post-Processing:** SSR (Screen Space Reflections), Bloom, and Color Grading.
- **VFX:** Particle systems for "Blood" and "Magic Impact".
- **Lighting:** Dynamic dungeon shadows.
