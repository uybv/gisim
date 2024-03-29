import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { AdditiveType, Character, CharacterBase, TransformativeType } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  AThousandFloatingDreams = "A Thousand Floating Dreams",
}

export class Nahida extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Nahida, 90);

    var weapon = new Weapon(WeaponTypes.AThousandFloatingDreams, 90);

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.DmgBonus, 0.15);
    artifacts.setBonus(ValueType.ResistanceReduction, 0.3);

    var buff = new Buff();

    //buff.setBuff(ValueType.DefReduction, 0.3); // Nahida C2

    super(char, weapon, artifacts, buff);

    if (weapon.name == WeaponTypes.AThousandFloatingDreams) {
      buff.setBuff(ValueType.DmgBonus, 0.3); // 3 char
    }
  }

  override get dmgBonus(): number {
    var em2DmgBonus = 0;
    if (this.em > 200) {
      em2DmgBonus = (this.em - 200) * 0.1 / 100;
      if (em2DmgBonus > 0.8) {
        em2DmgBonus = 0.8;
      }
    }
    return super.dmgBonus
      //+ 0.35712000727653503 // Add 2 char hoa
      + em2DmgBonus; // Giác Ngộ Thức Tỉnh
  }
  override get critRate(): number {
    var em2CritRate = 0;
    if (this.em > 200) {
      em2CritRate = (this.em - 200) * 0.03 / 100;
      if (em2CritRate > 0.24) {
        em2CritRate = 0.24;
      }
    }
    return super.critRate + em2CritRate; // Giác Ngộ Thức Tỉnh
  }
  override get em(): number {
    var qbuffEm = this.coreEm * 0.25;
    if (qbuffEm > 250) {
      qbuffEm = 250;
    }
    return super.em + qbuffEm;
  }

  override get additiveType(): AdditiveType {
    return AdditiveType.None;
  }

  get talent(): number {
    return 0; // Ignore
  }
  get baseDmg(): number {
    var talentParams = this.char.talentE?.attributes.parameters;
    var scaleByAtk = talentParams
      ? talentParams["param3"][this.talentLevel - 1]
      : 0;
    var scaleByEm = talentParams
      ? talentParams["param4"][this.talentLevel - 1]
      : 0;
    return scaleByAtk * this.atk + scaleByEm * this.em;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.er < 1.35) {
      return false;
    }
    /*
    if (this.critRate < 0.4) {
      return false;
    }
    */
    return true;
  }

  readonly sandsTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.EmFlat,
    //ValueType.Er
  ];

  readonly gobletTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.DmgBonus,
    ValueType.EmFlat
  ];

  readonly circletTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.EmFlat
  ];

  readonly upTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    ValueType.EmFlat
  ];
}

