import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from "../components/shared/shared.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {
}
