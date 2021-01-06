import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompileComponent} from './compile.component';
import {FormsModule} from '@angular/forms';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {ActionButtonModule} from "../../components/action-button/action-button.module";
import {RouterModule, Routes} from "@angular/router";

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/meta';

const routes: Routes = [
  {
    path: '',
    component: CompileComponent,
  },
];


@NgModule({
  declarations: [CompileComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, CodemirrorModule,
    ActionButtonModule],
})
export class CompileModule {
}
