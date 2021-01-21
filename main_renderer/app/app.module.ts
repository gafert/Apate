import 'reflect-metadata';
import '../polyfills';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {popperVariation, TippyModule, withContextMenuVariation} from "@ngneat/helipopper";
import {Props} from "tippy.js";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";

const tooltipVariation1: Partial<Props> = {
  theme: 'light',
  arrow: true,
  animation: 'shift-toward-subtle',
  trigger: 'mouseenter',
  offset: [0, 5]
};

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule)},
];

@NgModule({
  declarations: [AppComponent],
  imports: [RouterModule.forRoot(routes, {useHash: true, /* enableTracing: true */}),
    CommonModule, BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule, TippyModule.forRoot({
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
