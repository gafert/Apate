import 'reflect-metadata';
import '../polyfills';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingComponent} from "./components/setting/setting.component";
import {ActionButtonModule} from "./components/action-button/action-button.module";
import {CommonModule} from "@angular/common";
import {popperVariation, TippyModule, withContextMenuVariation} from "@ngneat/helipopper";
import {Props} from "tippy.js";
import {FormsModule} from "@angular/forms";

const tooltipVariation1: Partial<Props> = {
  theme: 'light',
  arrow: true,
  animation: 'shift-toward-subtle',
  trigger: 'mouseenter',
  offset: [0, 5]
};

@NgModule({
  declarations: [AppComponent],
  imports: [CommonModule, BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule, AppRoutingModule, TippyModule.forRoot({
    defaultVariation: 'tooltip',
    variations: {
      tooltip: tooltipVariation1,
      popper: popperVariation,
      contextMenu: withContextMenuVariation(popperVariation),
    }
  })],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
