import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompileComponent} from './compile.component';
import {FormsModule} from '@angular/forms';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {RouterModule, Routes} from "@angular/router";

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/meta';
import {MatButtonModule} from "@angular/material/button";
import {TippyModule} from "@ngneat/helipopper";

const routes: Routes = [
  {
    path: '',
    component: CompileComponent,
  },
];


@NgModule({
  declarations: [CompileComponent],
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, CodemirrorModule,
        MatButtonModule, TippyModule],
})
export class CompileModule {
}
