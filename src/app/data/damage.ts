import { AdditiveType, AMPLIFYING, AmplifyingType, Character, LEVEL_MULTIPLIER, TRANSFORMATIVE } from "./character";
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
  get transformativeReaction(): number {
    return TRANSFORMATIVE[this.character.transformativeType] * LEVEL_MULTIPLIER[this.character.char.level] * (1 + (16 * this.character.em) / (2000 + this.character.em) + this.character.reactionBonus) * this.enemyResMult;
  }
  get amplifyingReaction(): number {
    return this.character.amplifyingType != AmplifyingType.None
      ? AMPLIFYING[this.character.amplifyingType] * (1 + (2.78 * this.character.em) / (1400 + this.character.em) + this.character.reactionBonus)
      : 1;
  }
  get critAvg(): number {
    return 1 + this.character.critRate * this.character.critDmg;
  }
  get crit(): number {
    return 1 + this.character.critDmg;
  }
  get dmgNormal(): number {
    if (this.character.additiveType != AdditiveType.None) {
      return (this.dmgNormalWithAdditive + this.dmgNormalWithoutAdditive * 2) / 3;
    }
    return this.dmgNormalWithoutAdditive;
  }
  get dmgNormalWithAdditive(): number {
    return ((this.character.baseDmg * this.character.specialMultiplier) + this.character.flatDmg)
      * (1 + this.character.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * this.amplifyingReaction
      + this.transformativeReaction;
  }
  get dmgNormalWithoutAdditive(): number {
    return ((this.character.baseDmg * this.character.specialMultiplier) + this.character.flatDmgWithoutAdditive)
      * (1 + this.character.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * this.amplifyingReaction
      + this.transformativeReaction;
  }
  get dmgNormalOnlyAdditive(): number {
    return this.character.flatDmgAdditive
      * (1 + this.character.dmgBonus - this.enemy.damageReduction)
      * this.enemyDefMult
      * this.enemyResMult
      * this.amplifyingReaction
      + this.transformativeReaction;
  }
  get dmgCrit(): number {
    if (this.character.additiveType != AdditiveType.None) {
      return (this.dmgCritWithAdditive + this.dmgCritWithoutAdditive * 2) / 3;
    }
    return this.dmgCritWithoutAdditive;
  }
  get dmgCritWithAdditive(): number {
    return this.dmgNormalWithAdditive * this.crit;
  }
  get dmgCritWithoutAdditive(): number {
    return this.dmgNormalWithoutAdditive * this.crit;
  }

  get dmgAvg(): number {
    if (this.character.additiveType != AdditiveType.None) {
      return (this.dmgAvgWithAdditive + this.dmgAvgWithoutAdditive * 2) / 3;
    }
    return this.dmgAvgWithoutAdditive;
  }
  get dmgAvgWithAdditive(): number {
    return this.dmgNormalWithAdditive * this.critAvg;
  }
  get dmgAvgWithoutAdditive(): number {
    return this.dmgNormalWithoutAdditive * this.critAvg;
  }

}
