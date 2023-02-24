import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase, AmplifyingType } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  TheCatch = "The Catch",
}

export class Xiangling extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.Xiangling, 90);

    var weapon = new Weapon(WeaponTypes.TheCatch, 90);

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.Er, 0.2);

    var buff = new Buff();
    buff.setBuff(ValueType.AtkPercent, 0.25); // 2 hoa
    // Bennet buff
    buff.setBuff(ValueType.AtkPercent, 0.2); // tong that
    buff.setBuff(ValueType.AtkFlat, 800);
    buff.setBuff(ValueType.DmgBonus, 0.15);

    // Ei buff
    buff.setBuff(ValueType.DmgBonus, 0.3 * 80 / 100);

    if (weapon.name == WeaponTypes.TheCatch) {
      buff.setBuff(ValueType.CritRate, 0.12);
      buff.setBuff(ValueType.DmgBonus, 0.32);
    }

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
    var talentParams = this.char.talentQ?.attributes.parameters;
    return talentParams 
      ? talentParams["param4"][this.talentLevel - 1] 
      : 0;
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }
  override get amplifyingType(): AmplifyingType {
    return AmplifyingType.Vaporize;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.er < 2.2)
      return false;
    return true;
  }

  readonly sandsTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.Er,
    ValueType.EmFlat
  ];

  readonly gobletTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.DmgBonus,
    ValueType.EmFlat
  ];

  readonly circletTypes: ValueType[] = [
    //ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    //ValueType.EmFlat
  ];

  readonly upTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er,
    ValueType.EmFlat
  ];
}

