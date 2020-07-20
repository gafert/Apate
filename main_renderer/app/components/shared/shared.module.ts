import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SelectoOptionComponent } from '../selecto-option/selecto-option.component';
import { SettingComponent } from '../setting/setting.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActionButtonComponent, SelectoOptionComponent, SettingComponent],
  exports: [ActionButtonComponent, SelectoOptionComponent, SettingComponent],
  imports: [CommonModule, FormsModule],
})
export class SharedModule {}
