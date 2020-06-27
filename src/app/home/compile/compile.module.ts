import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompileComponent} from './compile.component';
import {CompileRoutingModule} from "./compile-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared/shared.module";
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@NgModule({
  declarations: [CompileComponent],
  imports: [
    CommonModule, CompileRoutingModule, FormsModule, SharedModule, CodemirrorModule,
  ]
})
export class CompileModule { }
