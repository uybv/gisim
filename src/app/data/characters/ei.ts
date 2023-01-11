import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

export class Ei extends Character {

    constructor() {
        var char = new CharacterBase(CharacterType.RaidenShogun, 81);

        var weapon = new Weapon("Engulfing Lightning", 90);
        console.log(weapon);

        var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
        artifacts.setBonus(ValueType.Er, 0.2); // 20% Er
        
        var buff = new Buff();
        buff.setBuff(ValueType.AtkFlat, 700); // Bennet buff

        // Nahida buff
        buff.setBuff(ValueType.EmFlat, 200);

        // Ei Buff
        buff.setBuff(ValueType.Er, 30); // Kiem tran sau khi Q
        buff.setBuff(ValueType.DmgBonus, 90 * 0.3 / 100); // Ei-E
        buff.setBuff(ValueType.DefIgnore, 0.6);

        super(char, weapon, artifacts, buff);
    }

    override get dmgBonus(): number {
        var dmgBonusBuff = (this.er - 1) * 0.25;
        if (dmgBonusBuff > 0.75)
            dmgBonusBuff = 0.75;
        return super.dmgBonus 
            + dmgBonusBuff // Set 4 dau an
            + (this.er - 1) * 0.004; // Convert ER to Dmg Bonus
    }
    override get atk(): number {
        var atkPercentConvert = (this.er - 1) * 0.28;
        if (atkPercentConvert > 0.8)
            atkPercentConvert = 0.8;
        return super.atk + this.baseAtk * atkPercentConvert; // Vu khi tran, convert ER to Atk
    }

    override get reactionMultiplier(): number {
        return 1.15;
    }
    get talent(): number {
        return 8.517000198364258; // Q lv13
    }
    get baseDmg(): number {
        return this.talent * this.atk;
    }

    get isValid(): boolean {
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

