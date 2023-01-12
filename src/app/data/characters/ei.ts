import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

export class Ei extends Character {

    constructor() {
        var char = new CharacterBase(CharacterType.RaidenShogun, 90);

        var weapon = new Weapon("Engulfing Lightning", 90);

        var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
        artifacts.setBonus(ValueType.Er, 0.2); // 20% Er
        
        var buff = new Buff();
        // Bennet buff
        buff.setBuff(ValueType.AtkFlat, 965); // Bennet atk
        buff.setBuff(ValueType.AtkPercent, 0.20); // Tong that co

        // Nahida buff
        buff.setBuff(ValueType.EmFlat, 200);

        // Kazuha buff
        /*
        buff.setBuff(ValueType.AtkPercent, 0.2); // Kiem tran kzh
        buff.setBuff(ValueType.DmgBonus, 0.4); // kzh 1000 tinh thong
        buff.setBuff(ValueType.ResistanceReduction, 0.4); // set 4 bong hinh mau xanh
        */

        // Sara
        /*
        buff.setBuff(ValueType.CritDmg, 0.6); // Sara buff crit dmg
        */

        // Ei Buff
        buff.setBuff(ValueType.Er, 0.3); // Kiem tran sau khi Q
        buff.setBuff(ValueType.DmgBonus, 90 * 0.3 / 100); // Ei-E
        buff.setBuff(ValueType.DefIgnore, 0.6);

        super(char, weapon, artifacts, buff);
    }

    override get dmgBonus(): number {
        // Set 4 dau an
        var dmgBonusBuff = this.er * 0.25;
        if (dmgBonusBuff > 0.75)
            dmgBonusBuff = 0.75;
        return super.dmgBonus 
            + dmgBonusBuff // Set 4 dau an
            + (this.er - 1) * 0.4; // Convert ER to Dmg Bonus
    }
    override get normalAtk(): number {
        var atkPercentConvert = (this.er - 1) * 0.28;
        if (atkPercentConvert > 0.8)
            atkPercentConvert = 0.8;
        return super.normalAtk + this.baseAtk * atkPercentConvert; // Vu khi tran, convert ER to Atk
    }

    override get reactionMultiplier(): number {
        return 1.15;
        //return 0;
    }
    get talent(): number {
        return 8.517000198364258 // Q lv13
            + (0.08262000232934952 * 60); // 60 y luc
    }
    get baseDmg(): number {
        return this.talent * this.atk;
    }

    override get isValid(): boolean {
        if (!super.isValid)
            return false;
        if (this.critRate < 0.65) {
            return false;
        }
        return true;
    }

    upCount: number = 30;

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
        ValueType.AtkPercent,
        ValueType.CritRate,
        ValueType.CritDmg,
        ValueType.EmFlat
    ];

    readonly upTypes: ValueType[] = [
        ValueType.AtkPercent,
        ValueType.AtkFlat,
        ValueType.CritRate,
        ValueType.CritDmg,
        ValueType.Er,
        ValueType.EmFlat
    ];
}

