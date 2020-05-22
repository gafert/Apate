import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SimulationModule} from "./home/simulation/simulation.module";
import {HomeModule} from "./home/home.module";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'home', loadChildren: () => HomeModule},
  {path: 'settings', component: SettingsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
