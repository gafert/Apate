import {NgModule} from '@angular/core';

import {MemoryCellComponent} from './components/memory-cell/memory-cell.component';
import {MemoryComponent} from './components/memory/memory.component';
import {InstructionsComponent} from './components/instructions/instructions.component';
import {RegistersComponent} from './components/registers/registers.component';
import {TerminalComponent} from './components/terminal/terminal.component';
import {SimulationComponent} from './simulation.component';
import {SimulationRoutingModule} from './simulation-routing.module';
import {ChangingValueComponent} from './components/changing-value/changing-value.component';
import {GraphComponent} from './components/graph/graph.component';
import {SignalsComponent} from './components/signals/signals.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonModule} from "@angular/common";
import {TippyModule} from "@ngneat/helipopper";
import {VerticalTabsComponent} from "../../components/vertical-tabs/vertical-tabs.component";
import {VerticalTabsItemComponent} from "../../components/vertical-tabs-item/vertical-tabs-item.component";
import {VarDirective} from "../../components/ngVar.directive";
import {ActionButtonModule} from "../../components/action-button/action-button.module";

@NgModule({
  declarations: [
    SimulationComponent,
    ChangingValueComponent,
    MemoryCellComponent,
    MemoryComponent,
    InstructionsComponent,
    RegistersComponent,
    TerminalComponent,
    GraphComponent,
    SignalsComponent, VerticalTabsComponent, VerticalTabsItemComponent, VarDirective
  ],
  imports: [CommonModule, SimulationRoutingModule, MatCheckboxModule, TippyModule,
    ActionButtonModule],
  providers: [],
})
export class SimulationModule {

}
