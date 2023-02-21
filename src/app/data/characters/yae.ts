import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { AdditiveType, Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  KagurasVerity = "Kagura's Verity",
}

export class Yae extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.YaeMiko, 81);

    var weapon = new Weapon(WeaponTypes.KagurasVerity, 90);

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.AtkPercent, 0.18); // 18% atk
    artifacts.setBonus(ValueType.AtkPercent, 0.18); // 18% atk
    //artifacts.setBonus(ValueType.EmFlat, 80); // 80 em
    //artifacts.setBonus(ValueType.EmFlat, 80); // 80 em

    var buff = new Buff();
    if (weapon.name == WeaponTypes.KagurasVerity) {
      buff.setBuff(ValueType.DmgBonus, 0.12 * 3) // 3 stack
      buff.setBuff(ValueType.DmgBonus, 0.12); // 12% dmg bonus (on 3 stack)
    }

    // Nahida buff
    //buff.setBuff(ValueType.EmFlat, 200);

    // Bennet tong that
    //buff.setBuff(ValueType.AtkPercent, 0.2);

    // Yelan tieng tho dai vo tan
    //buff.setBuff(ValueType.AtkPercent, 0.2);
    //buff.setBuff(ValueType.EmFlat, 200);

    // Ei Buff
    //buff.setBuff(ValueType.DmgBonus, 90 * 0.3 / 100); // Ei-E

    super(char, weapon, artifacts, buff);
  }

  override get dmgBonus(): number {
    return super.dmgBonus + (this.em * 0.0015); // Enlightened Blessing
  }
  override get additiveType(): AdditiveType {
    //return AdditiveType.Aggravate;
    return AdditiveType.None;
  }

  get talent(): number {
    return 1.516800045967102; // E Miko
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.er < 1.4) {
      return false;
    }
    if (this.critRate < 0.78) {
      return false;
    }
    return true;
  }

  upCount: number = 30;

  readonly sandsTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.EmFlat
  ];

  readonly gobletTypes: ValueType[] = [
    ValueType.AtkPercent,
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
    //ValueType.AtkFlat,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    ValueType.EmFlat
  ];
}

