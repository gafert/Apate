import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompileComponent } from './compile.component';
import {CompileRoutingModule} from "./compile-routing.module";
import {FormsModule} from "@angular/forms";
import { CompileButtonComponent } from './compile-button/compile-button.component';
import { SettingComponent } from '../../setting/setting.component';

@NgModule({
  declarations: [CompileComponent, CompileButtonComponent, SettingComponent],
  exports: [
    SettingComponent
  ],
  imports: [
    CommonModule, CompileRoutingModule, FormsModule
  ]
})
export class CompileModule { }
