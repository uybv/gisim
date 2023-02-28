import { Component } from '@angular/core';
import * as _ from 'lodash';
import { CalculatorService } from './calculator.service';
import { CalType, CharacterType, ValueType } from './data/common';
import { Damage } from './data/damage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gisim';

  public viewType: 'best' | 'top' = 'top';
  public dmgType: CalType = CalType.MainAvg;
  public character: CharacterType = _.first(this.calSrv.characterList) ?? CharacterType.Aether;
  public subStatCount: number = 30;
  public resultCount: number = 10;
  public maxTotalCv: number = 200;

  public characterList: CharacterType[] = this.calSrv.characterList;
  public viewTypeList: string[] = ['best', 'top'];
  public dmgTypeList: string[] = [CalType.Avg, CalType.Crit, CalType.MainAvg, CalType.MainCrit];

  public showAtk: boolean = true;
  public showDef: boolean = false;
  public showHp: boolean = false;
  public showEm: boolean = false;
  public showEr: boolean = true;
  public showCrit: boolean = true;
  public showRate: boolean = true;
  public showDmgBonus: boolean = true;
  public showFlatDmg: boolean = false;

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
    var currentStr = localStorage.getItem("current");
    if (currentStr) {
      var currentConf = JSON.parse(currentStr);
      this.viewType = currentConf.viewType;
      this.dmgType = currentConf.dmgType;
      this.character = currentConf.character;
      this.subStatCount = currentConf.subStatCount;
      this.resultCount = currentConf.resultCount;
      this.maxTotalCv = currentConf.maxTotalCv;
      this.showAtk = currentConf.showAtk;
      this.showCrit = currentConf.showCrit;
      this.showDef = currentConf.showDef;
      this.showDmgBonus = currentConf.showDmgBonus;
      this.showEm = currentConf.showEm;
      this.showEr = currentConf.showEr;
      this.showFlatDmg = currentConf.showFlatDmg;
      this.showHp = currentConf.showHp;
      this.showRate = currentConf.showRate;
    }
  }

  public onCal(e: any) {
    this.damages = this.calSrv.getBestBuild(this.character, this.dmgType, this.subStatCount, this.maxTotalCv, this.resultCount);
    var currentConf: any = {
      viewType: this.viewType,
      dmgType: this.dmgType,
      character: this.character,
      subStatCount: this.subStatCount,
      resultCount: this.resultCount,
      maxTotalCv: this.maxTotalCv,
      showAtk: this.showAtk,
      showCrit: this.showCrit,
      showDef: this.showDef,
      showDmgBonus: this.showDmgBonus,
      showEm: this.showEm,
      showEr: this.showEr,
      showFlatDmg: this.showFlatDmg,
      showHp: this.showHp,
      showRate: this.showRate,
    };
    localStorage.setItem("current", JSON.stringify(currentConf));
  }
}
