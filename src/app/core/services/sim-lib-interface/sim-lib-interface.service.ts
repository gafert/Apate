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

  private isWin = process.platform === "win32";
  private isMac = process.platform === "darwin";
  private isLinux = process.platform === "linux";

  private libraryPath;

  constructor() {
    let extension;
    if (this.isMac) {
      extension = "dylib";
    } else if (this.isLinux) {
      extension = "so";
    } else if (this.isWin) {
      extension = "dll";
    }

    this.libraryPath = './binaries/libVtestbench.' + extension;
    if (!isDev) {
      this.libraryPath = path.join(process.resourcesPath, 'binaries/libVtestbench.' + extension);
    }
  }

  initSimulation(pathToVerilogHex: string) {
    this.SimLib = new Library(this.libraryPath,
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
