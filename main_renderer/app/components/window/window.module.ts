import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {WindowComponent} from "./window.component";
import {NgModule} from "@angular/core";


@NgModule({
  declarations: [WindowComponent],
  imports: [
    CommonModule, FormsModule,
  ],
  exports: [
    WindowComponent
  ]
})
export class WindowModule {
}
