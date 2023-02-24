import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  SacrificialSword = "Sacrificial Sword",
  HaranGeppakuFutsu = "Haran Geppaku Futsu",
}

export class Xingqiu extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Xingqiu, 81);

    var weapon = new Weapon(WeaponTypes.HaranGeppakuFutsu, 90);
    if (weapon.name == WeaponTypes.HaranGeppakuFutsu) {
      weapon.setBonus(ValueType.DmgBonus, 0.12); // 12% dmg bonus
    }

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    //artifacts.setBonus(ValueType.Er, 0.2);
    artifacts.setBonus(ValueType.DmgBonus, 0.15); // 2 thuy
    artifacts.setBonus(ValueType.DmgBonus, 0.2); // 2 tong that

    var buff = new Buff();
    // Bennet buff
    buff.setBuff(ValueType.AtkPercent, 0.2); // tong that
    buff.setBuff(ValueType.AtkFlat, 800);

    // Ei buff
    buff.setBuff(ValueType.DmgBonus, 0.3 * 80 / 100);

    super(char, weapon, artifacts, buff);
  }
  override get dmgBonus(): number {
    return super.dmgBonus + 0.2; // xingqiu passive2
  }
  get talent(): number {
    var talentParams = this.char.talentQ?.attributes.parameters;
    return talentParams 
      ? talentParams["param1"][this.talentLevel - 1] 
      : 0;
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.weapon.name == WeaponTypes.SacrificialSword && this.er < 1.65) {
      return false;
    } else if (this.weapon.name == WeaponTypes.HaranGeppakuFutsu && this.er < 1.9) {
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
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    //ValueType.EmFlat
  ];

  readonly upTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    //ValueType.EmFlat
  ];
}

