import {NgModule} from '@angular/core';

import {MemoryCellComponent} from './memory-cell/memory-cell.component';
import {MemoryComponent} from './memory/memory.component';
import {InstructionsComponent} from './instructions/instructions.component';
import {RegistersComponent} from './registers/registers.component';
import {TerminalComponent} from './terminal/terminal.component';
import {SimulationComponent} from './simulation.component';
import {SimulationRoutingModule} from './simulation-routing.module';
import {ChangingValueComponent} from './changing-value/changing-value.component';
import {SharedModule} from '../../components/shared/shared.module';
import {GraphComponent} from './graph/graph.component';
import {SignalsComponent} from './signals/signals.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

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
    SignalsComponent,
  ],
  imports: [SimulationRoutingModule, SharedModule, MatCheckboxModule],
  providers: [],
})
export class SimulationModule {}
