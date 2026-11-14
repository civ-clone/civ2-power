import Criterion from '@civ-clone/core-rule/Criterion';
import Detonates from '@civ-clone/base-unit-trait-detonates/Detonates';
import Effect from '@civ-clone/core-rule/Effect';
import MilitaryStrength from '@civ-clone/core-power/Rules/MilitaryStrength';
import Unit from '@civ-clone/core-unit/Unit';
import attackAndDefence from '@civ-clone/base-power/lib/strength';

// Civilization II's military strength, which its AI weighs other civilizations by: the attack and defence of every
//  unit but nuclear ones (OpenCiv2 `src/auto/ai.cpp:1192` and `:1283-1287`, which skip unit types attacking 99, the
//  nuclear missile): here those that `Detonates`. Civ2 adds up each type's listed attack and defence; this adds up each
//  unit's, as civ1-power does.
export const getRules: () => MilitaryStrength[] = (): MilitaryStrength[] => [
  new MilitaryStrength(
    'civ2-power:unit/strength/attack-and-defence',
    new Criterion((unit: Unit): boolean => !unit.hasTrait(Detonates)),
    new Effect(attackAndDefence)
  ),
];

export default getRules;
