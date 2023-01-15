import { Artifacts } from "../artifacts";
import { Buff } from "../buff";
import { Character, CharacterBase } from "../character";
import { CharacterType, ValueType } from "../common";
import { Weapon } from "../weapon";

export class Yae extends Character {

    constructor() {
        var char = new CharacterBase(CharacterType.YaeMiko, 81);

        var weapon = new Weapon("Kagura's Verity", 90);

        var artifacts = new Artifacts(ValueType.AtkPercent, ValueType.DmgBonus, ValueType.CritDmg);
        // artifacts.setBonus(ValueType.AtkPercent, 0.18); // 18% atk
        // artifacts.setBonus(ValueType.AtkPercent, 0.18); // 18% atk
        artifacts.setBonus(ValueType.EmFlat, 80); // 80 em
        artifacts.setBonus(ValueType.EmFlat, 80); // 80 em
        
        var buff = new Buff();
        buff.setBuff(ValueType.DmgBonus, 0.12 * 3) // 3 stack
        buff.setBuff(ValueType.DmgBonus, 0.12); // 12% dmg bonus (on 3 stack)

        // Nahida buff
        buff.setBuff(ValueType.EmFlat, 200);

        // Ei Buff
        buff.setBuff(ValueType.DmgBonus, 90 * 0.3 / 100); // Ei-E

        super(char, weapon, artifacts, buff);
    }

    override get dmgBonus(): number {
        return super.dmgBonus + (this.em * 0.0015); // Enlightened Blessing
    }
    override get reactionMultiplier(): number {
        return 1.15;
    }

    get talent(): number {
        return 1.7064000368118286; // Q-Ayaka lv10
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
