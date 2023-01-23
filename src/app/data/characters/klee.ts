import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { AmplifyingType, Character, CharacterBase, TransformativeType } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  KagurasVerity = "Kagura's Verity",
  LostPrayerToTheSacredWinds = "Lost Prayer to the Sacred Winds"
}

export class Klee extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Klee, 81);

    var weapon = new Weapon(WeaponTypes.LostPrayerToTheSacredWinds, 90);
    if (weapon.name == WeaponTypes.LostPrayerToTheSacredWinds) {
      weapon.setBonus(ValueType.DmgBonus, 0.12); // 12% dmg bonus
    }

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.EmFlat, 80);

    var buff = new Buff();
    // Zhongli buff
    buff.setBuff(ValueType.AtkPercent, 0.2); // thien nham

    // artifacts
    buff.setBuff(ValueType.DmgBonus, 0.35); // 35% st trong kich

    super(char, weapon, artifacts, buff);
  }

  override get amplifyingType(): AmplifyingType {
    return AmplifyingType.Vaporize;
  }
  get talent(): number {
    return 2.5177600383758545; // trong kich lv8
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }

  override get isValid(): boolean {
    if (!super.isValid) {
      return false;
    }
    if (this.critRate < 0.65) {
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
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    ValueType.EmFlat
  ];
}

