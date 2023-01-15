import * as _ from 'lodash';
import { ValueType } from "./common";

export interface IArtifacts {
    setUpCounts(upCounts: Record<ValueType, number>): void;
    setUpCount(type: ValueType, upCount: number): void;
    getUpCount(type: ValueType): number;
    getUpValue(type: ValueType): number;
    setBonus(type: ValueType, value: number): void;
    cleanBonus(): void;
    getValue(type: ValueType): number;
}

export const UP: Record<ValueType, number> = {
    [ValueType.AtkFlat]: (13.62 + 15.56 + 17.51 + 19.45) / 4,
    [ValueType.AtkPercent]: (4.08 + 4.66 + 5.25 + 5.83) / 400,
    [ValueType.DefFlat]: (16.20 + 18.52 + 20.83 + 23.15) / 4,
    [ValueType.DefPercent]: (5.10 + 5.83 + 6.56 + 7.29) / 400,
    [ValueType.HpFlat]: (209.13 + 239.00 + 268.88 + 298.75) / 4,
    [ValueType.HpPercent]: (4.08 + 4.66 + 5.25 + 5.83) / 400,
    [ValueType.EmFlat]: (16.32 + 18.65 + 20.98 + 23.31) / 4,
    [ValueType.EmPercent]: 0,
    [ValueType.Er]: (4.53 + 5.18 + 5.83 + 6.48) / 400,
    [ValueType.CritRate]: (2.72 + 3.11 + 3.50 + 3.89) / 400,
    [ValueType.CritDmg]: (5.44 + 6.22 + 6.99 + 7.77) / 400,
    [ValueType.DmgBonus]: 0,
    [ValueType.HealBonus]: 0,
    [ValueType.FlatDmg]: 0,
    [ValueType.ResistanceReduction]: 0,
    [ValueType.DefReduction]: 0,
    [ValueType.DefIgnore]: 0
};

export const BASE: Record<ValueType, number> = {
    [ValueType.AtkFlat]: 311,
    [ValueType.AtkPercent]: 0.466,
    [ValueType.DefFlat]: 0,
    [ValueType.DefPercent]: 0.583,
    [ValueType.HpFlat]: 4780,
    [ValueType.HpPercent]: 0.466,
    [ValueType.EmFlat]: 186.5,
    [ValueType.EmPercent]: 0,
    [ValueType.Er]: 0.518,
    [ValueType.CritRate]: 0.311,
    [ValueType.CritDmg]: 0.622,
    [ValueType.DmgBonus]: 0.466,
    [ValueType.HealBonus]: 0,
    [ValueType.FlatDmg]: 0,
    [ValueType.ResistanceReduction]: 0,
    [ValueType.DefReduction]: 0,
    [ValueType.DefIgnore]: 0
}

export class Artifacts implements IArtifacts {

    public upCounts: Record<ValueType, number> = {
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

    private get base(): Record<ValueType, number> {
        return {
            [ValueType.AtkFlat]: BASE.AtkFlat,
            [ValueType.AtkPercent]: (this.sandsType == ValueType.AtkPercent ? BASE.AtkPercent : 0) + (this.gobletType == ValueType.AtkPercent ? BASE.AtkPercent : 0) + (this.circletType == ValueType.AtkPercent ? BASE.AtkPercent : 0),
            [ValueType.DefFlat]: 0,
            [ValueType.DefPercent]: (this.sandsType == ValueType.DefPercent ? BASE.DefPercent : 0) + (this.gobletType == ValueType.DefPercent ? BASE.DefPercent : 0) + (this.circletType == ValueType.DefPercent ? BASE.DefPercent : 0),
            [ValueType.HpFlat]: BASE.HpFlat,
            [ValueType.HpPercent]: (this.sandsType == ValueType.HpPercent ? BASE.HpPercent : 0) + (this.gobletType == ValueType.HpPercent ? BASE.HpPercent : 0) + (this.circletType == ValueType.HpPercent ? BASE.HpPercent : 0),
            [ValueType.EmFlat]: (this.sandsType == ValueType.EmFlat ? BASE.EmFlat : 0) + (this.gobletType == ValueType.EmFlat ? BASE.EmFlat : 0) + (this.circletType == ValueType.EmFlat ? BASE.EmFlat : 0),
            [ValueType.EmPercent]: 0,
            [ValueType.Er]: (this.sandsType == ValueType.Er ? BASE.Er : 0),
            [ValueType.CritRate]: (this.circletType == ValueType.CritRate ? BASE.CritRate : 0),
            [ValueType.CritDmg]: (this.circletType == ValueType.CritDmg ? BASE.CritDmg : 0),
            [ValueType.DmgBonus]: (this.gobletType == ValueType.DmgBonus ? BASE.DmgBonus : 0),
            [ValueType.HealBonus]: 0,
            [ValueType.FlatDmg]: 0,
            [ValueType.ResistanceReduction]: 0,
            [ValueType.DefReduction]: 0,
            [ValueType.DefIgnore]: 0
        };
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
        public sandsType: ValueType,
        public gobletType: ValueType,
        public circletType: ValueType
    ) {
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
    setUpCounts(upCounts: Record<ValueType, number>): void {
        this.upCounts = upCounts;
    }
    setUpCount(type: ValueType, upCount: number): void {
        this.upCounts[type] = upCount;
    }
    getUpCount(type: ValueType): number {
        return this.upCounts[type];
    }
    getUpValue(type: ValueType): number {
        return this.getUpCount(type) * UP[type];
    }
    setBonus(type: ValueType, value: number): void {
        this.bonus[type] += value;
    }
    getValue(type: ValueType): number {
        return this.base[type] + this.getUpValue(type) + this.bonus[type];
    }
}
