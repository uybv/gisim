import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { AdditiveType, Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  LightOfFoliarIncision = "Light of Foliar Incision",
  HaranGeppakuFutsu = "Haran Geppaku Futsu"
}

export class Alhaitham extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Alhaitham, 90);

    var weapon = new Weapon(WeaponTypes.LightOfFoliarIncision, 90);
    if (weapon.name == WeaponTypes.LightOfFoliarIncision) {
      weapon.setBonus(ValueType.CritRate, 0.04); // 4% crit rate
    } else if (weapon.name == WeaponTypes.HaranGeppakuFutsu) {
      weapon.setBonus(ValueType.DmgBonus, 0.12); // 12% dmg bonus
    }

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.DmgBonus, 0.15); // 15% st thao
    artifacts.setBonus(ValueType.ResistanceReduction, 0.3); // giam khang 30%

    var buff = new Buff();
    buff.setBuff(ValueType.EmFlat, 50); // cong huong 2 thao

    // Nahida
    buff.setBuff(ValueType.EmFlat, 200); // Nahida buff tinh thong

    super(char, weapon, artifacts, buff);
  }

  get talent(): number {
    return 1.9456000328063965; // lv8
  }
  get baseDmg(): number {
    //return 1.9456000328063965 * this.atk + 1.556480050086975 * this.em;
    return 1.0751999616622925 * this.atk + 2.150399923324585 * this.em;
    //return 1.510395 * this.atk + 1.853435 * this.em;
  }
  override get flatDmg(): number {
    var weaponBuffFlatDmg = 0;
    if (this.weapon.name == WeaponTypes.LightOfFoliarIncision) {
      weaponBuffFlatDmg = this.em * 1.2;
    }
    return super.flatDmg + weaponBuffFlatDmg;
  }
  override get dmgBonus(): number {
    // Alhaitham convert em to dmg bonus
    var em2dmgBonus = (this.em * 0.1 / 100);
    if (em2dmgBonus > 1) {
      em2dmgBonus = 1;
    }
    return super.dmgBonus + em2dmgBonus;
  }
  override get additiveType(): AdditiveType {
    return AdditiveType.Spread;
    //return AdditiveType.None;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.er < 1.35) {
      return false;
    }
    if (this.critRate < 0.75) {
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
    //ValueType.AtkPercent,
    ValueType.DmgBonus,
    //ValueType.EmFlat
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
    ValueType.EmFlat,
    ValueType.Er,
  ];
}

