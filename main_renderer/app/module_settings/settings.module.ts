import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { WindowModule } from '../components/window/window.module';
import { SettingModule } from '../components/setting/setting-module.module';
import { TippyModule } from '@ngneat/helipopper';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  }
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    RouterModule.forChild(routes), CommonModule, FormsModule, MatButtonModule, WindowModule, SettingModule, TippyModule, HttpClientModule
  ]
})
export class SettingsModule {
}
