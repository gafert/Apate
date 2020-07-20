import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Bindings } from './bindingSubjects';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class SimLibInterfaceService implements OnDestroy {
  public bindings = new Bindings();
  public elfIsLoaded = false;
  public currentlyLoadedElf: string;
  private folderPath;
  private toolchainPath;
  private toolchainPrefix;

  constructor(private dataService: DataService, private ngZone: NgZone) {
    ipcRenderer.on('simulation-library', (event, arg) => {
      this.ngZone.run(() => {
        const { command, payload } = arg;
        switch (command) {
          case 'set-simulation-variable':
            for (const variable of payload.variables as {name: string; value: any}[]) {
              this.bindings[variable.name + '__subject'].next(variable.value);
            }
            break;
          case 'elf-loaded':
            this.elfIsLoaded = true;
            this.currentlyLoadedElf = payload.path;
            break;
          case 'buffer-write':
            this.bindings.callBufferWriteCallbacks(payload.character);
            break;
        }
      });
    });

    this.dataService.folderPath.subscribe((value) => (this.folderPath = value));
    this.dataService.toolchainPath.subscribe((value) => (this.toolchainPath = value));
    this.dataService.toolchainPrefix.subscribe((value) => (this.toolchainPrefix = value));
  }

  initSimulation(pathToElf: string) {
    this.messageToSimulation('load-elf', {
      elfPath: pathToElf,
      toolchainPath: this.toolchainPath,
      toolchainPrefix: this.toolchainPrefix,
      folderPath: this.folderPath
    });
  }

  advanceSimulationClock() {
    this.messageToSimulation('advance-clock');
  }

  advanceSimulationPc() {
    this.messageToSimulation('advance-pc');
  }

  messageToSimulation(command, payload?) {
    ipcRenderer.send('simulation-command', { command: command, payload: payload });
  }

  ngOnDestroy(): void {
    this.bindings = null;
  }
}
