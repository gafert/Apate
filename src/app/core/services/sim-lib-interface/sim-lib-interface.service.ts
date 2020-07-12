import { Injectable, OnDestroy } from '@angular/core';
import { spawn } from 'child_process';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as electron from 'electron';
import { DataService } from '../data.service';
import Bindings from './bindings';

@Injectable({
  providedIn: 'root'
})
export class SimLibInterfaceService implements OnDestroy {
  public bindings = new Bindings();
  public elfIsLoaded = false;
  public currentlyLoadedElf: string;
  private ffi = require('ffi-napi');
  private SimLib;
  private isWin = process.platform === 'win32';
  private isMac = process.platform === 'darwin';
  private isLinux = process.platform === 'linux';
  private libraryPath;

  private folderPath;
  private toolchainPath;
  private toolchainPrefix;
  private objcopyFlags = '-O verilog';

  constructor(private dataService: DataService) {
    console.log('Constructed sim-lib-interface.service');
    let extension;
    if (this.isMac) {
			extension = 'dylib';
		} else if (this.isLinux) {
			extension = 'so';
		} else if (this.isWin) {
			extension = 'dll';
		}

		this.libraryPath = path.join(process.resourcesPath, 'binaries', 'libVtestbench.' + extension);
		if (isDev) {
			this.libraryPath = path.join(electron.remote.app.getAppPath(), 'binaries', 'libVtestbench.' + extension);
		}

		this.dataService.folderPath.subscribe((value) => (this.folderPath = value));
		this.dataService.toolchainPath.subscribe((value) => (this.toolchainPath = value));
		this.dataService.toolchainPrefix.subscribe((value) => (this.toolchainPrefix = value));
	}

	initSimulation(pathToElf: string) {
		if (!this.elfIsLoaded) {
      // Only load once in the service
      this.SimLib = new this.ffi.Library(this.libraryPath, {
        advance_simulation_with_statechange: ['void', []],
        advance_simulation_with_pc: ['void', []],
        advance_simulation_with_clock: ['void', []],
        init_simulation: ['void', ['string']],
        ...this.bindings.function_definitions
      });
    }

		this.generateHexFromElf(pathToElf).then((hexPath) => {
      this.SimLib.init_simulation.async(hexPath, (error, result) => {
        console.log(`asynchronously got ${result}`);

        for (let i = 0; i < 100; i++) {
          this.SimLib.advance_simulation_with_clock.async(() => {
          });
        }

        this.bindings.setPointers(this.SimLib);

        if (!this.elfIsLoaded) {
          // Only start timer once
          this.bindings.detectValueChanged();
        }

        this.elfIsLoaded = true;
        this.currentlyLoadedElf = pathToElf;
      });
    });
  }

  ngOnDestroy(): void {
    this.SimLib = null;
    this.bindings = null;
  }

  advanceSimulationClock() {
    this.SimLib.advance_simulation_with_clock.async(() => {
    });
  }

  advanceSimulationPc() {
    this.SimLib.advance_simulation_with_pc.async(() => {
    });
  }

  generateHexFromElf(elfPath) {
    return new Promise((resolve, reject) => {
      const gcc = spawn(path.join(this.toolchainPath, this.toolchainPrefix + 'objcopy'), [
        ...`${this.objcopyFlags} ${elfPath} ${path.join(this.folderPath, 'program.hex')}`.split(' ')
      ]);
      gcc.on('error', (err) => {
        console.error('Failed to start gcc', err);
        reject();
      });
			gcc.on('close', (code) => {
				console.log('Exited objcopy with code', code);
				if (code === 0) {
					resolve(path.join(this.folderPath, 'program.hex'));
				} else {
					reject();
				}
			});
		});
	}
}
