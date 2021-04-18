import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompileComponent} from './compile.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from "@angular/router";

import {MatButtonModule} from "@angular/material/button";
import {TippyModule} from "@ngneat/helipopper";
import {MonacoEditorModule} from "@materia-ui/ngx-monaco-editor";

const routes: Routes = [
  {
    path: '',
    component: CompileComponent,
  },
];


@NgModule({
  declarations: [CompileComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule,
    MatButtonModule, TippyModule, MonacoEditorModule],
})
export class CompileModule {
}
