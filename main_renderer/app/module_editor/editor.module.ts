import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { WindowModule } from '../components/window/window.module';
import { TippyModule } from '@ngneat/helipopper';
import { HttpClientModule } from '@angular/common/http';
import {MatSliderModule} from "@angular/material/slider";

const routes: Routes = [
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  declarations: [EditorComponent],
    imports: [
        RouterModule.forChild(routes), CommonModule, FormsModule, MatButtonModule, WindowModule, TippyModule, HttpClientModule, MatSliderModule
    ]
})
export class EditorModule {
}
