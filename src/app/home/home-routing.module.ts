import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {SimulationModule} from "./simulation/simulation.module";
import {CompileModule} from "./compile/compile.module";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'simulation', loadChildren: () => SimulationModule
      },
      {
        path: 'compile', loadChildren: () => CompileModule
      },
      {
        path: '**',
        redirectTo: 'compile'
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
