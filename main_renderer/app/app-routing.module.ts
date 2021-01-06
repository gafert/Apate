import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule)  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, /* enableTracing: true */ })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
