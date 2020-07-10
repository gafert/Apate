import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{
				path: 'simulation',
				loadChildren: () => import('./simulation/simulation.module').then((m) => m.SimulationModule),
			},
			{ path: 'compile', loadChildren: () => import('./compile/compile.module').then((m) => m.CompileModule) },
			{
				path: '**',
				redirectTo: 'compile',
			},
		],
	},
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomeRoutingModule {}
