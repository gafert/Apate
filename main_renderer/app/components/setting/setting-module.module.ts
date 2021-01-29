import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingComponent} from "./setting.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SettingComponent]
})
export class SettingModule { }
