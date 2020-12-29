import 'reflect-metadata';
import '../polyfills';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SettingsComponent} from './settings/settings.component';
import {SharedModule} from './components/shared/shared.module';
import {popperVariation, TippyModule, withContextMenuVariation} from "@ngneat/helipopper";
import {Props} from "tippy.js";

const tooltipVariation1: Partial<Props> = {
  theme: 'light',
  arrow: true,
  animation: 'shift-toward-subtle',
  trigger: 'mouseenter',
  offset: [0, 5]
};

@NgModule({
  declarations: [AppComponent, SettingsComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, AppRoutingModule,
    SharedModule.forRoot(),
    TippyModule.forRoot({
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
