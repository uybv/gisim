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
  public dmgType: 'avg' | 'crit' = 'avg';
  public character: CharacterType = CharacterType.Aether;
  public subStatCount: number = 30;

  public characterList: CharacterType[] = Object.values(CharacterType);
  public viewTypeList: string[] = ['best', 'top'];
  public dmgTypeList: string[] = ['avg', 'crit'];
  

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
    [ValueType.DefPercent]: "%DEF"
  };

  public get damage(): Damage | undefined {
    return _.first(this.damages);
  }

  public damages: Damage[] | undefined;

  constructor(public calSrv: CalculatorService) {
    //this.damages = this.calSrv.getBestBuild(CharacterType.YaeMiko, "crit", 35, 100);
    //this.damages = this.calSrv.getBestBuild(CharacterType.KamisatoAyaka, "avg", 30, 10);
    //this.damages = this.calSrv.getBestBuild(CharacterType.RaidenShogun, "avg", 30, 10);
    //this.damages = this.calSrv.getBestBuild(CharacterType.Nahida, "avg", 30, 10);
    //this.damages = this.calSrv.getBestBuild(CharacterType.Alhaitham, "crit", 30, 10);
    //this.damages = this.calSrv.getBestBuild(CharacterType.Xingqiu, "avg", 30, 10);
  }

  public onCal(e: any) {
    this.damages = this.calSrv.getBestBuild(this.character, this.dmgType, this.subStatCount, 10);
  }
}
