import * as genshindb from 'genshin-db';
import { SpecializedType, ValueType } from './common';

export interface IWeapon {
    get atk(): number;
    getValue(type: ValueType): number;
    setBonus(type: ValueType, value: number): void;
    cleanBonus(): void;
}

export class Weapon implements IWeapon {

    private readonly weaponInfo: genshindb.Weapon | undefined;
    private readonly weaponStats: genshindb.StatResult | undefined;

    private base: Record<ValueType, number> = {
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

    private bonus: Record<ValueType, number> = {
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

    constructor(
        public readonly name: string,
        public readonly level: number
    ) {
        this.weaponInfo = genshindb.weapons(name);
        this.weaponStats = this.weaponInfo?.stats(level);
        if (this.weaponInfo && this.weaponStats) {
            var sub = this.weaponInfo.substat.toLowerCase();
            var val = Number(this.weaponStats.specialized);
            if (sub.includes(SpecializedType.Atk)) {
                this.base.AtkPercent += val;
            }
            else if (sub.includes(SpecializedType.Def)) {
                this.base.DefPercent += val;
            }
            else if (sub.includes(SpecializedType.Hp)) {
                this.base.HpPercent += val;
            }
            else if (sub.includes(SpecializedType.CritDmg)) {
                this.base.CritDmg += val;
            }
            else if (sub.includes(SpecializedType.CritRate)) {
                this.base.CritRate += val;
            }
            else if (sub.includes(SpecializedType.EM)) {
                this.base.EmFlat += val;
            }
            else if (sub.includes(SpecializedType.ER)) {
                this.base.Er += val;
            }
            else if (sub.includes(SpecializedType.DmgBonus)) {
                this.base.DmgBonus += val;
            }
        }
    }
    cleanBonus(): void {
        this.bonus = {
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
    }
    getValue(type: ValueType): number {
        return this.base[type] + this.bonus[type];
    }
    setBonus(type: ValueType, value: number): void {
        this.bonus[type] += value;
    }
    get atk(): number {
        return this.weaponStats?.attack ?? 0;
    }
}

