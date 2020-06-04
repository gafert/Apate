import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompileComponent} from './compile.component';
import {CompileRoutingModule} from "./compile-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared/shared.module";
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [CompileComponent],
  imports: [
    CommonModule, CompileRoutingModule, FormsModule, SharedModule, MonacoEditorModule
  ]
})
export class CompileModule { }
