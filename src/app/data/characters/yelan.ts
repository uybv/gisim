import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { AdditiveType, Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  ElegyForTheEnd = "Elegy for the End",
  AquaSimulacra = "Aqua Simulacra",
  FavoniusWarbow = "Favonius Warbow"
}

export class Yelan extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Yelan, 81);
    var weapon = new Weapon(WeaponTypes.AquaSimulacra, 90);
    if (weapon.name == WeaponTypes.AquaSimulacra) {
      weapon.setBonus(ValueType.HpPercent, 0.16); // 16% HP
    }

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.Er, 0.2); // 20% Er

    var buff = new Buff();
    if (weapon.name == WeaponTypes.AquaSimulacra) {
      buff.setBuff(ValueType.DmgBonus, 0.2); // 20% dmg bonus
    }

    // passive1
    buff.setBuff(ValueType.HpPercent, 0.18);

    // 2 thuy
    //buff.setBuff(ValueType.HpPercent, 0.25);

    super(char, weapon, artifacts, buff);
  }

  override get dmgBonus(): number {
    // Set 4 dau an
    var artifactDmgBonus = this.er * 0.25;
    if (artifactDmgBonus > 0.75) {
      artifactDmgBonus = 0.75;
    }

    return super.dmgBonus
      + artifactDmgBonus; // artifact
  }

  get talent(): number {
    return 0.07795199751853943; // Q lv8
  }
  get baseDmg(): number {
    return this.talent * this.hp;
  }

  override get isValid(): boolean {
    if (!super.isValid) {
      return false;
    }
    if (this.weapon.name == WeaponTypes.FavoniusWarbow) {
      if (this.er < 1.85) {
        return false;
      }
    } else {
      if (this.er < 1.95) {
        return false;
      }
    }
    if (this.critRate < 0.7) {
      return false;
    }
    return true;
  }

  upCount: number = 30;

  readonly sandsTypes: ValueType[] = [
    //ValueType.AtkPercent,
    //ValueType.EmFlat,
    ValueType.Er,
    ValueType.HpPercent,
  ];

  readonly gobletTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.DmgBonus,
    //ValueType.EmFlat,
    //ValueType.HpPercent,
  ];

  readonly circletTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    //ValueType.EmFlat,
    ValueType.HpPercent,
  ];

  readonly upTypes: ValueType[] = [
    //ValueType.AtkPercent,
    //ValueType.AtkFlat,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    //ValueType.EmFlat,
    ValueType.HpPercent,
    //ValueType.HpFlat
  ];
}

