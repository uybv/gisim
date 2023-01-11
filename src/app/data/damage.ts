import { Character } from "./character";
import { Enemy } from "./enemy";

export class Damage {
    constructor(
        public character: Character,
        public enemy: Enemy
    ) {
    }

    get enemyDefMult(): number {
        return (this.character.char.level + 100) / ((this.character.char.level + 100) + (this.enemy.level + 100) * (1 - this.character.defReduction) * (1 - this.character.defIgnore));
    }
    get enemyResMult(): number {
        var res = this.enemy.resistance - this.character.resistanceReduction;
        if (res < 0) {
            return 1 - res / 2;
        } else if (res >= 0 && res < 0.75) {
            return 1 - res;
        } else {
            return 1 / (4 * res + 1);
        }
    }
    get critAvg(): number {
        return 1 + this.character.critRate * this.character.critDmg;
    }
    get crit(): number {
        return 1 + this.character.critDmg;
    }
    get dmgNormal(): number {
        return ((this.character.baseDmg * this.character.specialMultiplier) + this.character.flatDmg) 
            * (1 + this.character.dmgBonus - this.enemy.damageReduction)
            * this.enemyDefMult
            * this.enemyResMult;
    }
    get dmgCrit(): number {
        return this.dmgNormal * this.crit;
    }
    get dmgAvg(): number {
        return this.dmgNormal * this.critAvg;
    }

}