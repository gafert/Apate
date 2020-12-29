import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionButtonComponent} from '../action-button/action-button.component';
import {SelectoOptionComponent} from '../selecto-option/selecto-option.component';
import {SettingComponent} from '../setting/setting.component';
import {FormsModule} from '@angular/forms';
import {VarDirective} from '../ngVar.directive';
import {TippyDirective} from '../tippy.directive';
import {TippyModule} from "@ngneat/helipopper";

@NgModule({
  declarations: [ActionButtonComponent, SelectoOptionComponent, SettingComponent, VarDirective, TippyDirective],
  exports: [CommonModule, FormsModule, ActionButtonComponent, SelectoOptionComponent, SettingComponent, VarDirective, TippyDirective, TippyModule],
  imports: [CommonModule, FormsModule, TippyModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
    };
  }
}
