import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Ayaka } from './data/characters/ayaka';
import { Damage } from './data/damage';
import { Enemy } from './data/enemy';
import { CalType, CharacterType, ValueType } from './data/common';
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

  public get characterList(): CharacterType[] {
    return [
      CharacterType.KamisatoAyaka,
      CharacterType.YaeMiko,
      CharacterType.RaidenShogun,
      CharacterType.Nahida,
      CharacterType.Alhaitham,
      CharacterType.Xingqiu,
      CharacterType.Klee,
      CharacterType.Xiangling,
      CharacterType.Yelan,
    ].sort();
  }

  private getCharacter(charType: CharacterType): Character | undefined {
    switch (charType) {
      case CharacterType.KamisatoAyaka:
        return new Ayaka();
      case CharacterType.YaeMiko:
        return new Yae();
      case CharacterType.RaidenShogun:
        return new Ei();
      case CharacterType.Nahida:
        return new Nahida();
      case CharacterType.Alhaitham:
        return new Alhaitham();
      case CharacterType.Xingqiu:
        return new Xingqiu();
      case CharacterType.Klee:
        return new Klee();
      case CharacterType.Xiangling:
        return new Xiangling();
      case CharacterType.Yelan:
        return new Yelan();
      default:
        return undefined;
    }
  }

  public getBestBuild(
      charType: CharacterType,
      dmgType: CalType = CalType.MainAvg,
      upCount: number = 31,
      maxTotalCv: number = 200,
      buildCount: number = 20): Damage[] | undefined {
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
    character.maxTotalCv = maxTotalCv;
    const subStats = character.getSubStats();
    const mainStats = character.getMainStats();
    console.log(subStats);
    console.log(mainStats);

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
          if (dmgType == CalType.MainAvg || dmgType == CalType.MainCrit) {
            if (bestByMains[bKey] < (dmgType == CalType.MainAvg ? damage.dmgAvg : damage.dmgCrit)) {
              if (bestByMains[bKey] == 0) {
                listBuild.push({
                  sandType: character.artifacts.sandsType,
                  gobletType: character.artifacts.gobletType,
                  circletType: character.artifacts.circletType,
                  ups: _.clone(character.artifacts.upCounts),
                  dmg: (dmgType == CalType.MainAvg ? damage.dmgAvg : damage.dmgCrit)
                });
              } else {
                listBuild[listBuild.length - 1] = {
                  sandType: character.artifacts.sandsType,
                  gobletType: character.artifacts.gobletType,
                  circletType: character.artifacts.circletType,
                  ups: _.clone(character.artifacts.upCounts),
                  dmg: (dmgType == CalType.MainAvg ? damage.dmgAvg : damage.dmgCrit)
                };
              }
              bestByMains[bKey] = (dmgType == CalType.MainAvg ? damage.dmgAvg : damage.dmgCrit);
            }
          } else if (dmgType == CalType.Avg || dmgType == CalType.Crit) {
            listBuild.push({
              sandType: character.artifacts.sandsType,
              gobletType: character.artifacts.gobletType,
              circletType: character.artifacts.circletType,
              ups: _.clone(character.artifacts.upCounts),
              dmg: dmgType == CalType.Avg ? damage.dmgAvg : damage.dmgCrit
            });
            listBuild = listBuild.sort((a, b) => {
              return a.dmg < b.dmg ? 1 : -1;
            });
            listBuild = listBuild.slice(0, buildCount);
          }
        }
      });
      
    });

    var result: Damage[] = listBuild
      .sort((a, b) => a.dmg < b.dmg ? 1 : -1)
      .map(b => {
        var tempChar = this.getCharacter(charType) as Character;
        tempChar.artifacts.sandsType = b.sandType;
        tempChar.artifacts.gobletType = b.gobletType;
        tempChar.artifacts.circletType = b.circletType;
        tempChar.artifacts.setUpCounts(b.ups);
        return new Damage(tempChar, enemy);
      });

    console.log(_.first(result));

    return result;
  }
}
