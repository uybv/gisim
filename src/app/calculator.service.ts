import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Ayaka } from './data/characters/ayaka';
import { Damage } from './data/damage';
import { Enemy } from './data/enemy';
import { CharacterType, ValueType } from './data/common';
import { Character } from './data/character';
import { Yae } from './data/characters/yae';
import { Ei } from './data/characters/ei';
import { Nahida } from './data/characters/nahida';
import { Alhaitham } from './data/characters/alhaitham';
import { Xingqiu } from './data/characters/xingqiu';
import { Klee } from './data/characters/klee';
import { Yelan } from './data/characters/yelan';
import { Xiangling } from './data/characters/xiangling';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  private getCharacter(char: CharacterType): Character | undefined {
    if (char == CharacterType.KamisatoAyaka) {
      return new Ayaka();
    } 
    else if (char == CharacterType.YaeMiko) {
      return new Yae();
    }
    else if (char == CharacterType.RaidenShogun) {
      return new Ei();
    }
    else if (char == CharacterType.Nahida) {
      return new Nahida();
    }
    else if (char == CharacterType.Alhaitham) {
      return new Alhaitham();
    }
    else if (char == CharacterType.Xingqiu) {
      return new Xingqiu();
    }
    else if (char == CharacterType.Klee) {
      return new Klee();
    }
    else if (char == CharacterType.Yelan) {
      return new Yelan();
    }
    else if (char == CharacterType.Xiangling) {
      return new Xiangling();
    }
    return undefined;
  }

  public getBestBuild(charType: CharacterType, dmgType: 'avg' | 'crit' | 'best' = 'avg', upCount: number = 31, buildCount: number = 20): Damage[] | undefined {
    var checkChar = this.getCharacter(charType);
    if (!checkChar) {
      return undefined;
    }

    var character: Character = checkChar;
    var enemy = new Enemy();
    var damage = new Damage(character, enemy);

    let listBuild: {
      sandType: ValueType,
      gobletType: ValueType,
      circletType: ValueType,
      ups: Record<ValueType, number>,
      dmg: number
    }[] = [];

    character.upCount = upCount;
    const subStats = character.getSubStats();
    const mainStats = character.getMainStats();

    let bestDmg = 0;
    let bestByMains: {
      [key: string]: number
    } = {};
    

    mainStats.forEach(main => {
      character.artifacts.sandsType = main.sandType;
      character.artifacts.gobletType = main.gobletType;
      character.artifacts.circletType = main.circletType;
      var bKey = main.sandType + "_" + main.gobletType + "_" + main.circletType;
      bestByMains[bKey] = 0;
      subStats.forEach(subStat => {
        character.artifacts.setUpCounts(subStat);
        if (character.isValid) {
          if (dmgType == 'best') {
            if (bestByMains[bKey] < damage.dmgAvg) {
              if (bestByMains[bKey] == 0) {
                listBuild.push({
                  sandType: character.artifacts.sandsType,
                  gobletType: character.artifacts.gobletType,
                  circletType: character.artifacts.circletType,
                  ups: _.clone(character.artifacts.upCounts),
                  dmg: damage.dmgAvg
                });
              } else {
                listBuild[listBuild.length - 1] = {
                  sandType: character.artifacts.sandsType,
                  gobletType: character.artifacts.gobletType,
                  circletType: character.artifacts.circletType,
                  ups: _.clone(character.artifacts.upCounts),
                  dmg: damage.dmgAvg
                };
              }
              bestByMains[bKey] = damage.dmgAvg;
            }
          } else if (dmgType == 'avg' ? (bestDmg < damage.dmgAvg) : (bestDmg < damage.dmgCrit)) {
            listBuild.push({
              sandType: character.artifacts.sandsType,
              gobletType: character.artifacts.gobletType,
              circletType: character.artifacts.circletType,
              ups: _.clone(character.artifacts.upCounts),
              dmg: dmgType == 'avg' ? damage.dmgAvg : damage.dmgCrit
            });
            listBuild = listBuild.sort((a, b) => {
              return a.dmg < b.dmg ? 1 : -1;
            });
            listBuild = listBuild.slice(0, buildCount);
            bestDmg = _.last(listBuild)?.dmg ?? 0;
          }
        }
      });
      
    });

    var result: Damage[] = [];
    listBuild.sort((a, b) => a.dmg < b.dmg ? 1 : -1).forEach(b => {
      var tempChar = this.getCharacter(charType) as Character;
      tempChar.artifacts.sandsType = b.sandType;
      tempChar.artifacts.gobletType = b.gobletType;
      tempChar.artifacts.circletType = b.circletType;
      tempChar.artifacts.setUpCounts(b.ups);
      result.push(new Damage(tempChar, enemy));
    });

    console.log(_.first(result));

    return result;
  }
}
