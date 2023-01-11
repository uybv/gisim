import * as _ from 'lodash';
import * as genshindb from 'genshin-db';
import { ValueType, CharacterType, SpecializedType, ICharacter, MainStat } from './common';
import { Weapon } from './weapon';
import { Artifacts } from './artifacts';
import { Buff } from './buff';

const BASE_CRIT: number = 0.5;
const BASE_RATE: number = 0.05;
const BASE_EM: number = 0;
const BASE_ER: number = 1;
const BASE_DMG_BONUS: number = 0;
const LEVEL_MULTIPLIER: {
    [key: number]: number
} = {
    90: 1446.85,
    89: 1405.10,
    88: 1363.46,
    87: 1325.48,
    86: 1288.95,
    85: 1253.84,
    84: 1210.18,
    83: 1176.37,
    82: 1142.98,
    81: 1110.00,
    80: 1077.44,
    79: 1044.79,
    78: 1011.22,
    77: 979.41,
    76: 946.75,
    75: 914.23,
};

export class CharacterBase implements ICharacter {

    protected readonly charInfo: genshindb.Character | undefined;
    protected readonly charStats: genshindb.StatResult | undefined;

    constructor(
        public readonly charType: CharacterType,
        public readonly level: number = 90
    ) {
        this.charInfo = genshindb.characters(charType);
        this.charStats = this.charInfo?.stats(level);
    }
    get atk(): number {
        return this.charStats?.attack ?? 0;
    }
    get hp(): number {
        return this.charStats?.hp ?? 0;
    }
    get def(): number {
        return this.charStats?.defense ?? 0;
    }
    get dmgBonus(): number {
        return this.charInfo?.substat.toLowerCase().includes(SpecializedType.DmgBonus) ? (this.charStats?.specialized ?? 0) : BASE_DMG_BONUS;
    }
    get critDmg(): number {
        return this.charInfo?.substat.toLowerCase().includes(SpecializedType.CritDmg) ? (this.charStats?.specialized ?? 0) : BASE_CRIT;
    }
    get critRate(): number {
        return this.charInfo?.substat.toLowerCase().includes(SpecializedType.CritRate) ? (this.charStats?.specialized ?? 0) : BASE_RATE;
    }
    get em(): number {
        return this.charInfo?.substat.toLowerCase().includes(SpecializedType.EM) ? (this.charStats?.specialized ?? 0) : BASE_EM;
    }
    get er(): number {
        return this.charInfo?.substat.toLowerCase().includes(SpecializedType.ER) ? (this.charStats?.specialized ?? 0) : BASE_ER;
    }
}

interface SplitNumber {
    a: number;
    b: number | SplitNumber[];
}

export abstract class Character implements ICharacter {
    constructor(
        public char: CharacterBase,
        public weapon: Weapon,
        public artifacts: Artifacts,
        public buff: Buff
    ) {
    }

    get baseAtk(): number {
        return this.char.atk + this.weapon.atk;
    }
    get baseHp(): number {
        return this.char.hp;
    }
    get baseDef(): number {
        return this.char.def;
    }
    private get coreEm(): number {
        return this.char.em + this.weapon.getValue(ValueType.EmFlat) + this.artifacts.getValue(ValueType.EmFlat);
    }
    private get baseEm(): number {
        return this.coreEm + this.buff.getBuff(ValueType.EmFlat);
    }
    get normalAtk(): number {
        return this.baseAtk * (1 + this.weapon.getValue(ValueType.AtkPercent) + this.artifacts.getValue(ValueType.AtkPercent))
            + this.weapon.getValue(ValueType.AtkFlat) + this.artifacts.getValue(ValueType.AtkFlat);
    }
    get normalHp(): number {
        return this.baseHp * (1 + this.weapon.getValue(ValueType.HpPercent) + this.artifacts.getValue(ValueType.HpPercent))
            + this.weapon.getValue(ValueType.HpFlat) + this.artifacts.getValue(ValueType.HpFlat);
    }
    get normalDef(): number {
        return this.baseDef * (1 + this.weapon.getValue(ValueType.DefPercent) + this.artifacts.getValue(ValueType.DefPercent))
            + this.weapon.getValue(ValueType.DefFlat) + this.artifacts.getValue(ValueType.DefFlat);
    }
    get normalEm(): number {
        return this.coreEm * (1 + this.weapon.getValue(ValueType.EmPercent) + this.artifacts.getValue(ValueType.EmPercent));
    }
    get normalDmgBonus(): number {
        return this.char.dmgBonus + this.weapon.getValue(ValueType.DmgBonus) + this.artifacts.getValue(ValueType.DmgBonus);
    }
    get normalCritDmg(): number {
        return this.char.critDmg + this.weapon.getValue(ValueType.CritDmg) + this.artifacts.getValue(ValueType.CritDmg);
    }
    get normalCritRate(): number {
        let rate = this.char.critRate + this.weapon.getValue(ValueType.CritRate) + this.artifacts.getValue(ValueType.CritRate);
        if (rate > 1)
            return 1;
        return rate;
    }
    get normalEr(): number {
        return this.char.er + this.weapon.getValue(ValueType.Er) + this.artifacts.getValue(ValueType.Er);
    }

    get atk(): number {
        return this.normalAtk + this.baseAtk * this.buff.getBuff(ValueType.AtkPercent) + this.buff.getBuff(ValueType.AtkFlat);
    }
    get hp(): number {
        return this.normalHp + this.baseHp * this.buff.getBuff(ValueType.HpPercent) + this.buff.getBuff(ValueType.HpFlat);
    }
    get def(): number {
        return this.normalDef + this.baseDef * this.buff.getBuff(ValueType.DefPercent) + this.buff.getBuff(ValueType.DefFlat);
    }
    get em(): number {
        return this.baseEm * (1 + this.weapon.getValue(ValueType.EmPercent) + this.artifacts.getValue(ValueType.EmPercent) + this.buff.getBuff(ValueType.EmPercent));
    }
    get dmgBonus(): number {
        return this.normalDmgBonus + this.buff.getBuff(ValueType.DmgBonus);
    }
    get critDmg(): number {
        return this.normalCritDmg + this.buff.getBuff(ValueType.CritDmg);
    }
    get critRate(): number {
        let rate = this.normalCritRate + this.buff.getBuff(ValueType.CritRate);
        if (rate > 1)
            return 1;
        return rate;
    }
    get er(): number {
        return this.normalEr + this.buff.getBuff(ValueType.Er);
    }
    get flatDmg(): number {
        return this.weapon.getValue(ValueType.FlatDmg) + this.artifacts.getValue(ValueType.FlatDmg) + this.buff.getBuff(ValueType.FlatDmg)
            + this.reactionMultiplier * LEVEL_MULTIPLIER[this.char.level] * (1 + (5 * this.em) / (1200 + this.em) + this.reactionBonus);
    }
    get resistanceReduction(): number {
        return this.weapon.getValue(ValueType.ResistanceReduction) + this.artifacts.getValue(ValueType.ResistanceReduction) + this.buff.getBuff(ValueType.ResistanceReduction);
    }
    get defReduction(): number {
        return this.weapon.getValue(ValueType.DefReduction) + this.artifacts.getValue(ValueType.DefReduction) + this.buff.getBuff(ValueType.DefReduction);
    }
    get defIgnore(): number {
        return this.weapon.getValue(ValueType.DefIgnore) + this.artifacts.getValue(ValueType.DefIgnore) + this.buff.getBuff(ValueType.DefIgnore);
    }
    get specialMultiplier(): number {
        return 1;
    }
    get reactionMultiplier(): number {
        return 0;
    }
    get reactionBonus(): number {
        return 0;
    }
    abstract get talent(): number;
    abstract get baseDmg(): number;
    abstract readonly sandsTypes: ValueType[];
    abstract readonly gobletTypes: ValueType[];
    abstract readonly circletTypes: ValueType[];
    abstract readonly upTypes: ValueType[];
    abstract get isValid(): boolean;
    abstract upCount: number;

    getMainStats(): MainStat[] {
        let result: MainStat[] = [];
        this.sandsTypes.forEach(sandType => {
            this.gobletTypes.forEach(gobletType => {
                this.circletTypes.forEach(circletType => {
                    result.push({ sandType, gobletType, circletType });
                });
            });
        });
        return result;
    }

    private split(result: number[][], snapArray: number[], sum: number, len: number): void {
        if (len == 2) {
            for (let i = 0; i <= sum; i++) {
                var snap = _.clone(snapArray);
                snap.push(i);
                snap.push(sum - i);
                result.push(snap);
            }
        } else {
            for (let i = 0; i <= sum; i++) {
                var snap = _.clone(snapArray);
                snap.push(i);
                this.split(result, snap, sum - i, len - 1);
            }
        }
    }

    getSubStats(): Record<ValueType, number>[] {
        let result: Record<ValueType, number>[] = [];

        let list: number[][] = [];
        this.split(list, [], this.upCount, this.upTypes.length);
        list.forEach(ups => {
            var rd: Record<ValueType, number> = {
                [ValueType.AtkFlat]: 0,
                [ValueType.AtkPercent]: 0,
                [ValueType.DefFlat]: 0,
                [ValueType.DefPercent]: 0,
                [ValueType.HpFlat]: 0,
                [ValueType.HpPercent]: 0,
                [ValueType.EmFlat]: 0,
                [ValueType.EmPercent]: 0,
                [ValueType.Er]: 0,
                [ValueType.CritRate]: 0,
                [ValueType.CritDmg]: 0,
                [ValueType.DmgBonus]: 0,
                [ValueType.HealBonus]: 0,
                [ValueType.FlatDmg]: 0,
                [ValueType.ResistanceReduction]: 0,
                [ValueType.DefReduction]: 0,
                [ValueType.DefIgnore]: 0
            };
            this.upTypes.forEach((t, i) => {
                rd[t] = ups[i];
            });
            result.push(rd);
        });

        return result;
    }
}

