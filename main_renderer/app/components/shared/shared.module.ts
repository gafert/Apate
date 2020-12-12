import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SelectoOptionComponent } from '../selecto-option/selecto-option.component';
import { SettingComponent } from '../setting/setting.component';
import { FormsModule } from '@angular/forms';
import { VarDirective } from '../ngVar.directive';
import { TippyDirective } from '../tippy.directive';

@NgModule({
  declarations: [ActionButtonComponent, SelectoOptionComponent, SettingComponent, VarDirective, TippyDirective],
  exports: [ActionButtonComponent, SelectoOptionComponent, SettingComponent, VarDirective, TippyDirective],
  imports: [CommonModule, FormsModule],
})
export class SharedModule {}
