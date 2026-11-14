"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Detonates_1 = require("@civ-clone/base-unit-trait-detonates/Detonates");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const MilitaryStrength_1 = require("@civ-clone/core-power/Rules/MilitaryStrength");
const strength_1 = require("@civ-clone/base-power/lib/strength");
// Civilization II's military strength, which its AI weighs other civilizations by: the attack and defence of every
//  unit but nuclear ones (OpenCiv2 `src/auto/ai.cpp:1192` and `:1283-1287`, which skip unit types attacking 99, the
//  nuclear missile): here those that `Detonates`. Civ2 adds up each type's listed attack and defence; this adds up each
//  unit's, as civ1-power does.
const getRules = () => [
    new MilitaryStrength_1.default('civ2-power:unit/strength/attack-and-defence', new Criterion_1.default((unit) => !unit.hasTrait(Detonates_1.default)), new Effect_1.default(strength_1.default)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=strength.js.map