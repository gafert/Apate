import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'simulation',
        loadChildren: () => import('./simulation/simulation.module').then((m) => m.SimulationModule),
      },
      { path: 'compile',
        loadChildren: () => import('./compile/compile.module').then((m) => m.CompileModule) },
      {
        path: '**',
        redirectTo: 'simulation',
      },
    ],
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MatButtonModule],
})
export class HomeModule {
}
