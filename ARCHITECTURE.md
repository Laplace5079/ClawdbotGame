# Project Abyss: AAA Diablo-like Engine Architecture

## 1. Technical Stack
- **Framework:** React + React Three Fiber (R3F)
- **Physics:** Rapier.js (WASM Physics)
- **State Management:** Zustand (High performance, low boilerplate)
- **Build Tool:** Vite
- **Shaders:** Custom GLSL for "AAA" lighting and effects (Post-processing: Bloom, SSR, SSAO)

## 2. Core Modules
### A. Entity Component System (ECS)
- Handle high counts of enemies/projectiles.
- Systems: `Movement`, `Combat`, `Aura`, `AI`.

### B. Procedural Generation
- Recursive Backtracking or Cellular Automata for dungeon layouts.
- Dynamic NavMesh generation for AI pathfinding.

### C. Combat Logic
- Click-to-move (Pathfinding-based).
- Targeted and Skill-shot abilities.
- Authoritative calculation (ready for server-side migration).

## 3. Visual Identity
- Low-light, high-contrast "Dark Fantasy" aesthetics.
- PBR (Physically Based Rendering) materials.
- Particle systems for magic and gore.

## 4. Development Strategy
1. **Phase 1:** Core loop (Movement, Basic Combat, 1 Level).
2. **Phase 2:** Loot & Stats (The "Diablo" hook).
3. **Phase 3:** Visual Polish & Procedural World.
