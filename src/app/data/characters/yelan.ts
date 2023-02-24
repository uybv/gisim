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

  private artifactType: 'set4' | 'mix' = 'set4';
  private isC1: boolean = true;
  private isDouble: boolean = false;

  constructor() {
    var char = new CharacterBase(CharacterType.Yelan, 90);
    var weapon = new Weapon(WeaponTypes.AquaSimulacra, 90);
    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    var buff = new Buff();

    super(char, weapon, artifacts, buff);

    if (weapon.name == WeaponTypes.AquaSimulacra) {
      buff.setBuff(ValueType.DmgBonus, 0.2); // 20% dmg bonus
      buff.setBuff(ValueType.HpPercent, 0.16); // 16% HP
    }

    if (this.isDouble) {
      // passive1
      buff.setBuff(ValueType.HpPercent, 0.18);
      // 2 thuy
      buff.setBuff(ValueType.HpPercent, 0.25);
    } else {
      // passive1
      buff.setBuff(ValueType.HpPercent, 0.18);
    }

    if (this.artifactType == "set4") {
      artifacts.setBonus(ValueType.Er, 0.2); // 20% Er
    } else {
      artifacts.setBonus(ValueType.DmgBonus, 0.15); // 2 thuy
      artifacts.setBonus(ValueType.HpPercent, 0.2); // 2 hp
    }
  }

  override get dmgBonus(): number {
    if (this.artifactType == "set4") {
      // Set 4 dau an
      var artifactDmgBonus = this.er * 0.25;
      if (artifactDmgBonus > 0.75) {
        artifactDmgBonus = 0.75;
      }
      return super.dmgBonus + artifactDmgBonus; // artifact
    } else {
      return super.dmgBonus;
    }
  }

  get talent(): number {
    var talentParams = this.char.talentQ?.attributes.parameters;
    return talentParams 
      ? talentParams["param2"][this.talentLevel - 1] 
      : 0;
  }
  get baseDmg(): number {
    return this.talent * this.hp;
  }

  override get isValid(): boolean {
    if (!super.isValid) {
      return false;
    }
    if (this.weapon.name == WeaponTypes.FavoniusWarbow) {
      if (this.er < (1.85 * (this.isC1 ? 0.8 : 1))) {
        return false;
      }
    } else {
      if (this.er < (2.1 * (this.isC1 ? 0.8 : 1))) {
        return false;
      }
    }
    if (this.critRate < 0.80) {
      return false;
    }
    return true;
  }

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
    ValueType.HpPercent,
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

