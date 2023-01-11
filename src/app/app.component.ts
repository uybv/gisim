import { Component } from '@angular/core';
import * as _ from 'lodash';
import { CalculatorService } from './calculator.service';
import { CharacterType } from './data/common';
import { Damage } from './data/damage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gisim';

  public viewType: 'best' | 'top' = 'top';

  public get damage(): Damage | undefined {
    return _.last(this.damages);
  }

  public damages: Damage[] | undefined;

  constructor(public calSrv: CalculatorService) {
    // this.damages = this.calSrv.getBestBuild(CharacterType.YaeMiko, "crit");
    // this.damages = this.calSrv.getBestBuild(CharacterType.KamisatoAyaka);
    this.damages = this.calSrv.getBestBuild(CharacterType.RaidenShogun, "crit");
  }
}
