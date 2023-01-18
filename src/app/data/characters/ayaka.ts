import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

enum WeaponTypes {
  MistsplitterReforged = "Mistsplitter Reforged",
}

export class Ayaka extends Character {

  constructor() {
    var char = new CharacterBase(CharacterType.KamisatoAyaka, 90);

    var weapon = new Weapon(WeaponTypes.MistsplitterReforged, 90);
    weapon.setBonus(ValueType.DmgBonus, 0.12); // 12% dmg bonus

    var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
    artifacts.setBonus(ValueType.DmgBonus, 0.15); // 15% st bang

    var buff = new Buff();
    buff.setBuff(ValueType.DmgBonus, 0.18);    // Ayaka A1
    buff.setBuff(ValueType.CritRate, 0.15);    // team 2 bang
    buff.setBuff(ValueType.CritRate, 0.40);    // set 4 bang
    buff.setBuff(ValueType.DmgBonus, 0.28);    // 3 stack asdsm

    // Kokomi
    buff.setBuff(ValueType.AtkPercent, 0.48);   // kokomi sach rong
    buff.setBuff(ValueType.AtkPercent, 0.20);   // kokomi set 4 thien nham

    // Kazuha
    buff.setBuff(ValueType.AtkPercent, 0.20);   // kazuha kiem tran
    buff.setBuff(ValueType.DmgBonus, 0.40);    // kazuha 1000 em
    //buff.setBuff(ValueType.EmFlat, 200);    // kazuha C2
    buff.setBuff(ValueType.ResistanceReduction, 0.40); // set 4 bong hinh mau xanh

    // + Shenhe
    buff.setBuff(ValueType.FlatDmg, 2600);   // shenhe buff flat dmg
    buff.setBuff(ValueType.ResistanceReduction, 0.15); // shenhe giam khang bang
    buff.setBuff(ValueType.DmgBonus, 0.15);    // shenhe buff st bang
    buff.setBuff(ValueType.DmgBonus, 0.15);    // shenhe buff st ky nang
    buff.setBuff(ValueType.AtkPercent, 0.20);   // shenhe set 4 tong that

    // + Ganyu
    //buff.setBuff(ValueType.DmgBonus, 0.2);     // Ganyu Q

    super(char, weapon, artifacts, buff);
  }

  get talent(): number {
    return 2.021399974822998; // Q-Ayaka lv10
  }
  get baseDmg(): number {
    return this.talent * this.atk;
  }

  override get isValid(): boolean {
    if (!super.isValid)
      return false;
    if (this.er < 1.35) {
      return false;
    }
    return true;
  }

  upCount: number = 30;

  readonly sandsTypes: ValueType[] = [
    ValueType.AtkPercent,
  ];

  readonly gobletTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.DmgBonus,
  ];

  readonly circletTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.CritRate,
    ValueType.CritDmg,
  ];

  readonly upTypes: ValueType[] = [
    ValueType.AtkPercent,
    ValueType.AtkFlat,
    ValueType.CritRate,
    ValueType.CritDmg,
    ValueType.Er
  ];
}

