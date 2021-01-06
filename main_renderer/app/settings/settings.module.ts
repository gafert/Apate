import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingsComponent} from "./settings.component";
import {SettingComponent} from "../components/setting/setting.component";
import {RouterModule, Routes} from "@angular/router";
import {ActionButtonModule} from "../components/action-button/action-button.module";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];


@NgModule({
  declarations: [SettingsComponent, SettingComponent],
  imports: [
    RouterModule.forChild(routes), CommonModule, FormsModule, ActionButtonModule
  ]
})
export class SettingsModule { }
