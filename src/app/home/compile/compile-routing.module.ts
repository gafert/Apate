import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompileComponent} from "./compile.component";

const routes: Routes = [
  {
    path: '',
    component: CompileComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompileRoutingModule {}
