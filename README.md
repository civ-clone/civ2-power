# civ2-power

Civilization II's terms for `core-power`, from OpenCiv2's reconstruction of the original (`src/auto/civ.cpp`,
`src/auto/ai.cpp`):

- **Rank:** 3 × advances + 8 × citizens + gold / 32. Units don't count.
- **Strength:** each unit's attack and defence, with nuclear units (those that `Detonates`) left out.

The computer players rank the civilizations by power, and weigh each other by strength.
