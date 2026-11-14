"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const rank_1 = require("@civ-clone/base-power/lib/rank");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
const Rank_1 = require("@civ-clone/core-power/Rules/Rank");
// Civilization II's power, worked out for every civilization each turn to rank them (OpenCiv2 `src/auto/civ.cpp`
//  `civ_update_power_ranks`, :3027):
//
//    3 × advances + 8 × citizens + gold / 32
//
// Units don't count: the function adds up a military power per unit type (`civ.cpp:3031-3048`) but never adds it in.
//  Civ2 counts the advances it has recorded for the civilization (`num_advances`); this counts every advance known.
const getRules = (cityRegistry = CityRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance) => {
    const advances = (0, rank_1.advancesTerm)(playerResearchRegistry);
    return [
        new Rank_1.default('civ2-power:player/rank/advances', new Effect_1.default((player) => 3 * advances(player))),
        new Rank_1.default('civ2-power:player/rank/citizens', new Effect_1.default((0, rank_1.citizensTerm)(8, cityRegistry, cityGrowthRegistry))),
        new Rank_1.default('civ2-power:player/rank/gold', new Effect_1.default((0, rank_1.treasuryTerm)(Gold_1.default, 32, playerTreasuryRegistry))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=rank.js.map