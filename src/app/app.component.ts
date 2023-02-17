import { Component } from '@angular/core';
import * as _ from 'lodash';
import { CalculatorService } from './calculator.service';
import { CharacterType, ValueType } from './data/common';
import { Damage } from './data/damage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gisim';

  public viewType: 'best' | 'top' = 'top';
  public dmgType: 'avg' | 'crit' | 'best' = 'avg';
  public character: CharacterType = CharacterType.Aether;
  public subStatCount: number = 30;
  public resultCount: number = 10;

  public characterList: CharacterType[] = Object.values(CharacterType);
  public viewTypeList: string[] = ['best', 'top'];
  public dmgTypeList: string[] = ['avg', 'crit', 'best'];


  public upNames: {
    [key: string]: string
  } = {
    [ValueType.AtkPercent]: "%ATK",
    [ValueType.CritDmg]: "%CRIT",
    [ValueType.CritRate]: "%RATE",
    [ValueType.DmgBonus]: "%BONUS",
    [ValueType.EmFlat]: "EM",
    [ValueType.Er]: "%ER",
    [ValueType.HpPercent]: "%HP",
    [ValueType.DefPercent]: "%DEF",
    [ValueType.AtkFlat]: "ATK",
    [ValueType.DefFlat]: "DEF",
    [ValueType.FlatDmg]: "FLAT DMG",
    [ValueType.HealBonus]: "%Heal",
    [ValueType.HpFlat]: "HP",
  };

  public get damage(): Damage | undefined {
    return _.first(this.damages);
  }

  public damages: Damage[] | undefined;

  constructor(public calSrv: CalculatorService) {
  }

  public onCal(e: any) {
    this.damages = this.calSrv.getBestBuild(this.character, this.dmgType, this.subStatCount, this.resultCount);
  }
}
