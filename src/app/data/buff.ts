import { ValueType } from "./common";

export interface IBuff {
  setBuff(type: ValueType, value: number): void;
  getBuff(type: ValueType): number;
  cleanBuff(): void;
}

export class Buff implements IBuff {
  private buff: Record<ValueType, number> = {
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

  setBuff(type: ValueType, value: number): void {
    this.buff[type] += value;
  }
  getBuff(type: ValueType): number {
    return this.buff[type];
  }
  cleanBuff(): void {
    this.buff = {
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
}