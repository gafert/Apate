import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, NgZone} from '@angular/core';
import {Library} from "ffi-napi";
import bindings from "./bindings";
import * as path from "path";
import isDev from "electron-is-dev"
import * as electron from "electron";
import {spawn} from "child_process";
import {DataService} from "../data.service";

@Injectable({
  providedIn: 'root'
})
export class SimLibInterfaceService {
  private SimLib;
  public bindings = bindings;

  private isWin = process.platform === "win32";
  private isMac = process.platform === "darwin";
  private isLinux = process.platform === "linux";

  public elfIsLoaded = false;
  public currentlyLoadedElf: string;

  private libraryPath;

  private folderPath;
  private toolchainPath;
  private toolchainPrefix;
  private objcopyFlags = "-O verilog";

  constructor(private dataService: DataService,
              private zone: NgZone) {
    let extension;
    if (this.isMac) {
      extension = "dylib";
    } else if (this.isLinux) {
      extension = "so";
    } else if (this.isWin) {
      extension = "dll";
    }

    this.libraryPath = path.join(process.resourcesPath, 'binaries', 'libVtestbench.' + extension);
    if (isDev) {
      this.libraryPath = path.join(electron.remote.app.getAppPath(), 'binaries', 'libVtestbench.' + extension);
    }

    this.dataService.folderPath.subscribe(value => this.folderPath = value);
    this.dataService.toolchainPath.subscribe(value => this.toolchainPath = value);
    this.dataService.toolchainPrefix.subscribe(value => this.toolchainPrefix = value);
  }

  initSimulation(pathToElf: string) {
    this.generateHexFromElf(pathToElf).then((hexPath) => {
      this.SimLib = new Library(this.libraryPath,
        {
          'advance_simulation_with_statechange': ['void', []],
          'advance_simulation_with_pc': ['void', []],
          'advance_simulation_with_clock': ['void', []],
          'init_simulation': ['void', ['string']],
          ...bindings.function_definitions
        });

      this.SimLib.init_simulation(hexPath);
      this.elfIsLoaded = true;
      this.currentlyLoadedElf = pathToElf;

      bindings.setPointers(this.SimLib);

      for (let i = 0; i < 100; i++) {
        this.SimLib.advance_simulation_with_clock();
      }
    })

    this.bindings.detectValueChanged();
  }

  advanceSimulationClock() {
    this.SimLib.advance_simulation_with_clock();
  }

  advanceSimulationPc() {
    this.SimLib.advance_simulation_with_pc();
  }

  generateHexFromElf(elfPath) {
    return new Promise((resolve, reject) => {
      const gcc = spawn(path.join(this.toolchainPath, this.toolchainPrefix + "objcopy"), [...`${this.objcopyFlags} ${elfPath} ${path.join(this.folderPath, "program.hex")}`.split(' ')]);
      gcc.on('error', (err) => {
        console.error('Failed to start gcc', err);
        reject()
      });
      gcc.on('close', (code) => {
        console.log('Exited objcopy with code', code);
        if (code === 0) {
          resolve(path.join(this.folderPath, "program.hex"));
        } else {
          reject();
        }
      });
    });
  }
}
