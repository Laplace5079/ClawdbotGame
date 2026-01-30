# PHASE6_PLAN.md: Numerical Balancing and 1.0 Release

## 1. Numerical Balancing
- **Power Curve:** Audit the XP-to-Level and Stat scaling to ensure progression feels meaningful but not trivial.
- **Drop Rates:** Tune the item rarity weights (Magic/Rare/Unique) for a "Diablo-like" chase experience.
- **Combat Tuning:** Adjust Boss HP and AOE damage to provide a challenging but fair encounter.

## 2. Stability & UX Polish
- **Final Build Audit:** Ensure `npm run build` is 100% clean.
- **Responsive UI:** Verify the Inventory and HUD layouts on different aspect ratios.
- **SFX Audit:** Ensure audio triggers don't overflow the buffer or lag the main thread.

## 3. 1.0 Release
- **Cleanup:** Remove debug visualizers (e.g., Rapier physics debug) for production.
- **Documentation:** Finalize README.md with clear instructions on how to run and play.
- **Deployment:** Tag the release on GitHub.
