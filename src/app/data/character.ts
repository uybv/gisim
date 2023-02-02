import * as _ from 'lodash';
import * as genshindb from 'genshin-db';
import { ValueType, CharacterType, SpecializedType, ICharacter, MainStat } from './common';
import { Weapon } from './weapon';
import { Artifacts, UP } from './artifacts';
import { Buff } from './buff';

const MAX_UP_ARTIFACT = 3;
const MAX_UP_CV = 23;

const BASE_CRIT: number = 0.5;
const BASE_RATE: number = 0.05;
const BASE_EM: number = 0;
const BASE_ER: number = 1;
const BASE_DMG_BONUS: number = 0;
export const LEVEL_MULTIPLIER: {
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

export enum AdditiveType {
  None = "None",
  Spread = "Spread",
  Aggravate = "Aggravate"
};

export enum TransformativeType {
  None = "None",
  Burgeon = "Burgeon",
  Hyperbloom = "Hyperbloom",
  Overloaded = "Overloaded",
  Bloom = "Bloom",
  Shattered = "Shattered",
  ElectroCharged = "ElectroCharged",
  Swirl = "Swirl",
  Superconduct = "Superconduct",
  Burning = "Burning",
};

export enum AmplifyingType {
  None = "None",
  Vaporize = "Vaporize", // Hydro => Pyro
  Melt = "Melt", // Pyro => Cryo
  VaporizeReverse = "VaporizeReverse", // Pyro => Hydro
  MeltReverse = "MeltReverse", // Cryo => Pyro
}

export const ADDITIVE: {
  [key: string]: number
} = {
  [AdditiveType.None]: 0,
  [AdditiveType.Spread]: 1.25,
  [AdditiveType.Aggravate]: 1.15,
};

export const TRANSFORMATIVE: {
  [key: string]: number
} = {
  [TransformativeType.None]: 0,
  [TransformativeType.Burgeon]: 3.0,
  [TransformativeType.Hyperbloom]: 3.0,
  [TransformativeType.Overloaded]: 2.0,
  [TransformativeType.Bloom]: 2.0,
  [TransformativeType.Shattered]: 1.5,
  [TransformativeType.ElectroCharged]: 1.2,
  [TransformativeType.Swirl]: 0.6,
  [TransformativeType.Superconduct]: 0.5,
  [TransformativeType.Burning]: 0.25,
};

export const AMPLIFYING: {
  [key: string]: number
} = {
  [AmplifyingType.None]: 0,
  [AmplifyingType.Vaporize]: 2.0,
  [AmplifyingType.Melt]: 2.0,
  [AmplifyingType.VaporizeReverse]: 1.5,
  [AmplifyingType.MeltReverse]: 1.5,
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
    return BASE_ER + (this.charInfo?.substat.toLowerCase().includes(SpecializedType.ER) ? (this.charStats?.specialized ?? 0) : 0);
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
  get coreEm(): number {
    return this.char.em + this.weapon.getValue(ValueType.EmFlat) + this.artifacts.getValue(ValueType.EmFlat);
  }
  get flatEm(): number {
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
    return this.flatEm * (1 + this.weapon.getValue(ValueType.EmPercent) + this.artifacts.getValue(ValueType.EmPercent) + this.buff.getBuff(ValueType.EmPercent));
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
    return this.flatDmgWithoutAdditive + this.flatDmgAdditive;
  }
  get flatDmgWithoutAdditive(): number {
    return this.weapon.getValue(ValueType.FlatDmg)
      + this.artifacts.getValue(ValueType.FlatDmg)
      + this.buff.getBuff(ValueType.FlatDmg);
  }
  get flatDmgAdditive(): number {
    if (this.additiveType != AdditiveType.None) {
      return ADDITIVE[this.additiveType] * LEVEL_MULTIPLIER[this.char.level] * (1 + (5 * this.em) / (1200 + this.em) + this.reactionBonus);
    }
    return 0;
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
  get additiveType(): AdditiveType {
    return AdditiveType.None;
  }
  get transformativeType(): TransformativeType {
    return TransformativeType.None;
  }
  get amplifyingType(): AmplifyingType {
    return AmplifyingType.None;
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
  abstract upCount: number;

  get maxUpPer(): number {
    return MAX_UP_ARTIFACT;
  }
  get maxUpCv(): number {
    return MAX_UP_CV;
  }

  get isValid(): boolean {
    let valid = true;
    this.upTypes.forEach(upt => {
      let uC = this.artifacts.getUpCount(upt);
      let maxC = this.maxUpPer * 5;
      if (this.artifacts.sandsType == upt) {
        maxC -= this.maxUpPer;
      }
      if (this.artifacts.gobletType == upt) {
        maxC -= this.maxUpPer;
      }
      if (this.artifacts.circletType == upt) {
        maxC -= this.maxUpPer;
      }
      if (uC > maxC)
        valid = false;
    });

    var isMaxUp = (): boolean => {
      for (let t1 of this.upTypes) {
        for (let t2 of this.upTypes) {
          if (t1 != t2 && (this.artifacts.getUpCount(t1) + this.artifacts.getUpCount(t2) > this.maxUpCv)) {
            return true;
          }
        }
      }
      return false;
    };

    if (isMaxUp()) {
     return false;
    }
    return valid;
  }

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

