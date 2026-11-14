import {
  militaryPower,
  militaryStrength,
} from '@civ-clone/core-power/lib/strength';
import Detonates from '@civ-clone/base-unit-trait-detonates/Detonates';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import UnitTraits from '@civ-clone/core-unit/Rules/UnitTraits';
import { expect } from 'chai';
import playerRank from '../Rules/Player/rank';
import { rank } from '@civ-clone/core-power/lib/rank';
import unitStrength from '../Rules/Unit/strength';

class Warrior extends Unit {}
class Missile extends Unit {}

// Stand-ins for the registries: each rule only asks them for one player's entries.
const setUp = (gold: number) => {
  const ruleRegistry = new RuleRegistry(),
    player = new Player(ruleRegistry),
    standInUnit = (UnitType: typeof Unit, attack: number, defence: number) =>
      Object.assign(Object.create(UnitType.prototype), {
        // The rules' registry, which holds the trait declarations `unit.hasTrait()` reads.
        _ruleRegistry: ruleRegistry,
        attack: () => ({ value: () => attack }),
        defence: () => ({ value: () => defence }),
      }) as Unit,
    units = [
      standInUnit(Warrior, 1, 1),
      standInUnit(Warrior, 1, 1),
      standInUnit(Missile, 99, 0),
    ],
    cities = [{ size: 3 }, { size: 5 }];

  ruleRegistry.register(
    new UnitTraits(
      new Effect((UnitType: typeof Unit) =>
        UnitType === Missile ? [new Detonates()] : []
      )
    ),
    ...playerRank(
      { getByPlayer: () => cities } as any,
      {
        getByCity: (city: { size: number }) => ({ size: () => city.size }),
      } as any,
      { getByPlayer: () => ({ complete: () => new Array(7) }) } as any,
      { getByPlayerAndType: () => ({ value: () => gold }) } as any
    ),
    ...unitStrength()
  );

  return { player, ruleRegistry, units };
};

describe('civ2-power', () => {
  it("ranks a player by Civ2's terms: 3 × advances + 8 × citizens + gold / 32, and no units", () => {
    const { player, ruleRegistry } = setUp(100);

    // 3 × 7 = 21, 8 × 8 = 64, 100 / 32 = 3
    expect(rank(player, ruleRegistry)).equal(21 + 64 + 3);
  });

  it('truncates the gold: 31 gold counts nothing, 64 counts 2', () => {
    expect(rank(setUp(31).player, setUp(31).ruleRegistry)).equal(21 + 64);

    const { player, ruleRegistry } = setUp(64);

    expect(rank(player, ruleRegistry)).equal(21 + 64 + 2);
  });

  it('scores a player with no research or treasury yet by their citizens', () => {
    const ruleRegistry = new RuleRegistry();

    ruleRegistry.register(
      ...playerRank(
        { getByPlayer: () => [{ size: 4 }] } as any,
        {
          getByCity: (city: { size: number }) => ({ size: () => city.size }),
        } as any,
        {
          getByPlayer: () => {
            throw new TypeError('none');
          },
        } as any,
        {
          getByPlayerAndType: () => {
            throw new TypeError('none');
          },
        } as any
      )
    );

    expect(rank(new Player(ruleRegistry), ruleRegistry)).equal(32);
  });

  it('counts every unit but nuclear ones in military strength', () => {
    const { ruleRegistry, units } = setUp(0);

    expect(militaryStrength(units, ruleRegistry)).eql({
      attack: 2,
      defence: 2,
    });
    expect(militaryPower(units, ruleRegistry)).equal(4);
  });
});
