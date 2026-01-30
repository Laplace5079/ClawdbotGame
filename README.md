I will now write the Game Design Document to the `README.md` file. I'll use a shell command with a "here document" to write the multi-line markdown content.
I will replace the content of the existing `README.md` with the Game Design Document.
I am unable to write to the `README.md` file as the necessary file writing tools are not available in my current environment.

Here is the raw markdown content for the Game Design Document as requested:

# Project: Diablo-Clone

## Elevator Pitch

A dark fantasy, AAA browser-based ARPG that delivers a classic, loot-driven dungeon crawling experience powered by Babylon.js. Slay demons, collect epic gear, and customize your hero in a procedurally generated world, all accessible with a single click.

---

## 1. Core Gameplay Loop

The core loop is designed to be a tight, repeatable, and engaging cycle that keeps players coming back.

```
+-------------------+      +-------------------+
|                   |      |                   |
|   SLAY MONSTERS   +----->|   COLLECT LOOT    |
|                   |      |   (& Experience)  |
+--------+----------+      +---------+---------+
         ^                          |
         |                          |
         v
+--------+----------+      +---------+---------+
|                   |      |                   |
|  UPGRADE & BUILD  |<-----+   RETURN TO HUB   |
|  (Skills & Gear)  |      |                   |
+-------------------+      +-------------------+
```

1.  **Slay Monsters:** Players engage in fast-paced, visceral combat against hordes of demonic creatures in procedurally generated dungeons. Combat is action-oriented, requiring tactical positioning and skillful use of abilities.
2.  **Collect Loot:** Defeated enemies drop a wide variety of loot, including weapons, armor, and powerful runes. A deep and complex itemization system, featuring rarities, affixes, and unique properties, is the primary driver of player progression.
3.  **Return to Hub:** After clearing a dungeon or when their inventory is full, players return to a safe, persistent town hub.
4.  **Upgrade & Build:** In town, players identify and equip new gear, spend skill points earned from leveling up, and craft or trade items. This is where players make strategic decisions to define and enhance their character's "build," preparing them for greater challenges.

---

## 2. Technical Pillars

These are the foundational principles guiding our development and technology choices.

*   **Pillar 1: Instant Accessibility, AAA Feel:**
    *   **Browser-First:** The game must be playable in modern web browsers (Chrome, Firefox, Edge) without downloads or installations.
    *   **Performance:** Target a stable 60 FPS on mid-range hardware. Leverage Babylon.js for high-quality 3D graphics, PBR materials, and dynamic lighting that rival desktop experiences.
    *   **Fast Loading:** Utilize Vite for near-instant development builds and optimized production bundles. Aggressively code-split and asset-stream to ensure the player is in the game in seconds.

*   **Pillar 2: Modern, Type-Safe Development:**
    *   **TypeScript Everywhere:** The entire codebase will be written in TypeScript to ensure type safety, improve code quality, and enable robust tooling for large-scale development.
    *   **ECS Architecture:** Employ an Entity-Component-System (ECS) architecture for the core game logic. This promotes clean separation of concerns, enhances performance, and simplifies the management of complex game states and behaviors.
    *   **Modular & Data-Driven:** Design all systems (items, skills, enemies) to be data-driven. Game balance and content can be modified via configuration files (e.g., JSON or Scriptable Objects) without requiring code changes, enabling rapid iteration.

*   **Pillar 3: Procedural & Scalable World:**
    *   **Infinite Dungeons:** All combat zones will be procedurally generated to ensure high replayability. We will develop a robust dungeon generation system capable of creating varied and interesting layouts with distinct tile sets and lighting schemes.
    *   **Authoritative Server:** While the client handles rendering, all critical game logic (combat calculations, loot drops, character state) will be handled by an authoritative server to prevent cheating. For Phase 1, this can be a simple Node.js server, with potential to scale later.

---

## 3. Project Phase 1: The Foundation (Q1-Q2)

The goal of Phase 1 is to build a playable "vertical slice" that proves the core loop and technical pillars. This is not a polished demo, but a functional foundation.

**Key Deliverables:**

1.  **Player Character Controller:**
    *   Point-and-click movement and targeting.
    *   Functional Health and Mana resources.
    *   One playable class (e.g., "Warrior") with 2-3 distinct, usable abilities (e.g., a primary attack, an area-of-effect slam, a defensive buff).
    *   Basic inventory and equipment system (character can equip a weapon and armor).

2.  **Core Combat System (ECS-based):**
    *   Melee attack calculations (hit chance, damage).
    *   Ability execution logic.
    *   Enemy AI: A simple "zombie" AI that moves towards the player and attacks when in range.
    *   Health/death states for both player and enemies.

3.  **Procedural Dungeon Generation:**
    *   A basic random dungeon generator using a simple algorithm (e.g., random walk or cellular automata).
    *   Renders a single, non-themed tile set.
    *   Spawns a fixed number of enemies randomly within the generated layout.
    *   Includes a start point and an exit portal.

4.  **Itemization & Loot System:**
    *   Enemies drop loot upon death.
    *   A basic loot table with a few item types (e.g., Sword, Axe, Chest Armor, Helmet).
    *   Items have stats (e.g., +Damage, +Armor).
    *   Implement a simple rarity system (e.g., Common, Magic) where Magic items have one random affix from a small pool.

5.  **Technical & Engine Setup:**
    *   Vite project configured for TypeScript and Babylon.js.
    *   Babylon.js scene setup with a basic isometric camera.
    *   PBR lighting and material workflow established.
    -   Basic UI elements for Health/Mana, and ability hotbar.
