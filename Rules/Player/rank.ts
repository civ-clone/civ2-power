import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  advancesTerm,
  citizensTerm,
  treasuryTerm,
} from '@civ-clone/base-power/lib/rank';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Player from '@civ-clone/core-player/Player';
import Rank from '@civ-clone/core-power/Rules/Rank';

// Civilization II's power, worked out for every civilization each turn to rank them (OpenCiv2 `src/auto/civ.cpp`
//  `civ_update_power_ranks`, richardpenman/civ2@49f26ec):
//
//    3 × advances + 8 × citizens + gold / 32
//
// Units don't count: the function adds up a military power per unit type but never adds it in.
//  Civ2 counts the advances it has recorded for the civilization (`num_advances`); this counts every advance known.
export const getRules: (
  cityRegistry?: CityRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  playerTreasuryRegistry?: PlayerTreasuryRegistry
) => Rank[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance
): Rank[] => {
  const advances = advancesTerm(playerResearchRegistry);

  return [
    new Rank(
      'civ2-power:player/rank/advances',
      new Effect((player: Player): number => 3 * advances(player))
    ),
    new Rank(
      'civ2-power:player/rank/citizens',
      new Effect(citizensTerm(8, cityRegistry, cityGrowthRegistry))
    ),
    new Rank(
      'civ2-power:player/rank/gold',
      new Effect(treasuryTerm(Gold, 32, playerTreasuryRegistry))
    ),
  ];
};

export default getRules;
