import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MemoryCellComponent} from "./memory-cell/memory-cell.component";
import {CPUComponent} from "./cpu/cpu.component";
import {MemoryComponent} from "./memory/memory.component";
import {AluComponent} from "./alu/alu.component";
import {InstructionsComponent} from "./instructions/instructions.component";
import {RegistersComponent} from './registers/registers.component';
import {TerminalComponent} from './terminal/terminal.component';
import {SimulationComponent} from "./simulation.component";
import {SimulationRoutingModule} from "./simulation-routing.module";
import {ChangingValueComponent} from "./changing-value/changing-value.component";
import {SharedModule} from "../../components/shared/shared.module";
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [SimulationComponent, ChangingValueComponent, MemoryCellComponent, CPUComponent, MemoryComponent, AluComponent, InstructionsComponent, RegistersComponent, TerminalComponent, GraphComponent],
  imports: [CommonModule, SimulationRoutingModule, SharedModule]
})
export class SimulationModule {
}
