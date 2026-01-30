# PHASE4_PLAN.md: AAA Visual Polish, Shaders, and VFX

## 1. Post-Processing Stack
- **Library:** `@react-three/postprocessing`
- **Effects:**
    - **Bloom:** Add glow to rare loot orbs and magic effects.
    - **SSAO:** Deepen shadows in dungeon corners for "AAA" depth.
    - **Chromatic Aberration:** Subtle fringe for hit reactions.
    - **Color Grading:** LUT-based "Grim Dark" aesthetic.

## 2. Environment Lighting
- **Fog:** Implement exponential fog for dungeon atmosphere.
- **Dynamic Shadows:** Optimize shadow maps for rooms and corridors.
- **Point Lights:** Add flickering torches/magic sources.

## 3. VFX & Particles
- **Blood/Impact:** Particle bursts on enemy hits.
- **Loot Glow:** rarity-specific particle trails for unique items.

## 4. Animation Polish
- **Easing:** Smoother transitions for player and camera movement.
- **Hit Stops:** Short time-scale slowdowns on critical hits.
