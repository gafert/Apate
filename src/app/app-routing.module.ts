import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SimulationModule} from "./home/simulation/simulation.module";
import {HomeModule} from "./home/home.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'home', loadChildren: () => HomeModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
