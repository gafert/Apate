import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TippyModule } from '@ngneat/helipopper';
import { WindowModule } from '../components/window/window.module';
import { DemoProjectDescriptionComponent } from './components/demo-project-description/demo-project-description.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'simulation',
        loadChildren: () => import('./module_simulation/simulation.module').then((m) => m.SimulationModule),
      },
      { path: 'compile',
        loadChildren: () => import('./module_compile/compile.module').then((m) => m.CompileModule) },
      {
        path: '**',
        redirectTo: 'simulation',
      },
    ],
  },
];

@NgModule({
  declarations: [HomeComponent, DemoProjectDescriptionComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MatButtonModule, TippyModule, WindowModule, MatDialogModule],
})
export class HomeModule {
}
