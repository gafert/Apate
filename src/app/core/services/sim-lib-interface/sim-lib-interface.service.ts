import {Injectable} from '@angular/core';
import {Callback, Library} from "ffi-napi";
import bindings from "./bindings";
import * as path from "path";
import isDev from "electron-is-dev"

@Injectable({
  providedIn: 'root'
})
export class SimLibInterfaceService {
  private SimLib;
  public bindings = bindings;

  constructor() {
  }

  initSimulation(pathToVerilogHex: string) {
    let libraryPath = './binaries/libVtestbench.dylib';
    if (!isDev) {
      libraryPath = path.join(process.resourcesPath, 'binaries/libVtestbench.dylib');
    }

    this.SimLib = new Library(libraryPath,
      {
        'advance_simulation_with_statechange': ['void', []],
        'advance_simulation_with_pc': ['void', []],
        'advance_simulation_with_clock': ['void', []],
        'init_simulation': ['void', ['string']],
        ...bindings.function_definitions
      });

    this.SimLib.init_simulation(pathToVerilogHex);

    bindings.setPointers(this.SimLib);

    for (let i = 0; i < 100; i++) {
      this.SimLib.advance_simulation_with_clock();
    }
  }

  advanceSimulationClock() {
    this.SimLib.advance_simulation_with_clock();
  }

  advanceSimulationPc() {
    this.SimLib.advance_simulation_with_pc();
  }
}
