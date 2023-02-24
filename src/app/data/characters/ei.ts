import { Artifacts, UP } from "../artifacts";
import { Buff } from "../buff";
import { AdditiveType, Character, CharacterBase, TransformativeType } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";


enum WeaponTypes {
  TheCatch = "The Catch",
  EngulfingLightning = "Engulfing Lightning",
  WavebreakersFin = "Wavebreaker's Fin",
  PrimordialJadeWingedSpear = "Primordial Jade Winged-Spear",
  StaffOfHoma = "Staff of Homa",
  SkywardSpine = "Skyward Spine"
}

export class Ei extends Character {

  private readonly qStack: number = 50;
  private readonly isC2: boolean = true;

  constructor() {
    var char = new CharacterBase(CharacterType.RaidenShogun, 90);

    var weapon = new Weapon(WeaponTypes.EngulfingLightning, 90);

    if (weapon.name == WeaponTypes.StaffOfHoma) {
      weapon.setBonus(ValueType.HpPercent, 0.2);
    } else if (weapon.name == WeaponTypes.SkywardSpine) {
      weapon.setBonus(ValueType.CritRate, 0.08);
    }

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.Er, 0.2); // 20% Er

    var buff = new Buff();
    // 2 hoa
    buff.setBuff(ValueType.AtkPercent, 0.25); // 2 hoa

    // Bennet buff
    buff.setBuff(ValueType.AtkFlat, 800); // Bennet atk
    buff.setBuff(ValueType.AtkPercent, 0.20); // Tong that co

    // Yelan buff
    buff.setBuff(ValueType.DmgBonus, 0.25);

    // Nahida buff
    //buff.setBuff(ValueType.EmFlat, 200);

    // Kazuha buff
    //buff.setBuff(ValueType.AtkPercent, 0.2); // Kiem tran kzh
    //buff.setBuff(ValueType.DmgBonus, 0.4); // kzh 1000 tinh thong
    //buff.setBuff(ValueType.ResistanceReduction, 0.4); // set 4 bong hinh mau xanh


    // Sara
    //buff.setBuff(ValueType.CritDmg, 0.6); // Sara buff crit dmg
    //buff.setBuff(ValueType.AtkFlat, 500);

    // Weapon buff
    if (weapon.name == WeaponTypes.EngulfingLightning) {
      buff.setBuff(ValueType.Er, 0.3); // Kiem tran sau khi Q
    } else if (weapon.name == WeaponTypes.TheCatch) {
      buff.setBuff(ValueType.CritRate, 0.12);
      buff.setBuff(ValueType.DmgBonus, 0.32);
    } else if (weapon.name == WeaponTypes.WavebreakersFin) {
      buff.setBuff(ValueType.DmgBonus, 0.24 * (90 + 60 + 80 + 80) / 100);
    }

    // Ei Buff
    buff.setBuff(ValueType.DmgBonus, 90 * 0.3 / 100); // Ei-E

    super(char, weapon, artifacts, buff);

    if (this.isC2) {
      buff.setBuff(ValueType.DefIgnore, 0.6); // Ei C2
    }
  }

  override get dmgBonus(): number {
    // Set 4 dau an
    var artifactDmgBonus = this.er * 0.25;
    if (artifactDmgBonus > 0.75) {
      artifactDmgBonus = 0.75;
    }

    // Ei convert ER to Dmg bonus
    var eiDmgBonus = (this.er - 1) * 0.4; // Ei, convert 1% ER to 0.4% dmg bonus

    return super.dmgBonus
      + artifactDmgBonus // artifact
      + eiDmgBonus; // Convert ER to Dmg Bonus
  }
  override get normalAtk(): number {
    var weaponAtkBuff = 0;
    var weaponAtkFlatBuff = 0;
    if (this.weapon.name == WeaponTypes.EngulfingLightning) {
      weaponAtkBuff = (this.er - 1) * 0.28;
      if (weaponAtkBuff > 0.8) {
        weaponAtkBuff = 0.8;
      }
    } else if (this.weapon.name == WeaponTypes.StaffOfHoma) {
      weaponAtkFlatBuff = (this.hp * 0.8 / 100);
    }

    return super.normalAtk + this.baseAtk * weaponAtkBuff + weaponAtkFlatBuff; // Vu khi tran, convert ER to Atk
  }

  override get additiveType(): AdditiveType {
    return AdditiveType.None;
  }
  get talent(): number {
    var talentParams = this.char.talentQ?.attributes.parameters;
    var talentScale = talentParams
      ? (talentParams["param1"][this.talentLevel - 1] + talentParams["param2"][this.talentLevel - 1] * this.qStack) 
      : 0;
    return talentScale;
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;

    if (this.critRate < 0.69) {
        return false;
    }
    if (this.er < 2.95) {
      return false;
    }
    return true;
  }

  readonly sandsTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.Er,
    //ValueType.EmFlat
  ];

  readonly gobletTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.DmgBonus,
    //ValueType.EmFlat
  ];

  readonly circletTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.CritRate,
    //ValueType.CritDmg,
    //ValueType.EmFlat
  ];

  readonly upTypes: ValueType[] = [
    ValueType.AtkPercent,
    //ValueType.AtkFlat,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    //ValueType.EmFlat
  ];
}

