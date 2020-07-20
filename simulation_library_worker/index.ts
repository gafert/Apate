import { spawn } from 'child_process';
import * as parseArgs from 'minimist';
import * as path from 'path';
import { Library } from 'ffi-napi';
import { Bindings } from './bindings';
import * as net from 'net';

const bindings = new Bindings();
const objcopyFlags = '-O verilog';
const appPath = parseArgs(process.argv.slice(2)).appPath;
let simLib, elfIsLoaded, libraryIsLoaded;

function messageToMain(command, payload) {
  process.send({
    command: command,
    payload: payload
  });
}

function loadLibrary() {
  // process is also a local variable by webpack
  // use window.process to have electron version
  const isWin = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  let extension;
  if (isMac) {
    extension = 'dylib';
  } else if (isLinux) {
    extension = 'so';
  } else if (isWin) {
    extension = 'dll';
  }

  const libraryPath = path.join(appPath, 'binaries', 'libVtestbench.' + extension);

  if (!libraryIsLoaded) {
    // Only load once in the service
    simLib = new Library(libraryPath, {
      advance_simulation_with_statechange: ['void', []],
      advance_simulation_with_pc: ['void', []],
      advance_simulation_with_clock: ['void', []],
      init_simulation: ['void', ['string']],
      ...bindings.function_definitions
    });
    bindings.detectValueChanged((array) => {
      messageToMain('set-simulation-variable', { variables: array});
    });
    bindings.setBufferWriteCallback(character => {
      messageToMain('buffer-write', { character: character });
    });
    libraryIsLoaded = true;
  }
}

function generateHexFromElf(elfPath, toolchainPath, toolchainPrefix, folderPath) {
  return new Promise((resolve, reject) => {
    const gcc = spawn(path.join(toolchainPath, toolchainPrefix + 'objcopy'), [
      ...`${objcopyFlags} ${elfPath} ${path.join(folderPath, 'program.hex')}`.split(' ')
    ]);
    gcc.on('error', (err) => {
      console.error('Failed to start gcc', err);
      reject();
    });
    gcc.on('close', (code) => {
      console.log('Exited objcopy with code', code);
      if (code === 0) {
        resolve(path.join(folderPath, 'program.hex'));
      } else {
        reject();
      }
    });
  });
}

function loadElf(elfPath, toolchainPath, toolchainPrefix, folderPath) {
  if (!libraryIsLoaded) return;
  generateHexFromElf(elfPath, toolchainPath, toolchainPrefix, folderPath).then((hexPath) => {
    simLib.init_simulation(hexPath);
    for (let i = 0; i < 100; i++) {
      simLib.advance_simulation_with_clock();
    }
    bindings.setPointers(simLib);
    elfIsLoaded = true;
    messageToMain('elf-loaded', { path: elfPath });
  });
}

loadLibrary();
// loadElf('C:\\Users\\MGafe\\WebstormProjects\\RISC-V-Simulation\\risc_test_executable\\program.elf',
//   'C:\\Users\\MGafe\\AppData\\Roaming\\riscv-sim\\downloads\\riscv64-toolchain\\bin',
//   'riscv64-unknown-elf-',
//   'C:\\Users\\MGafe\\WebstormProjects\\RISC-V-Simulation\\risc_test_executable');

process.on('message', (message: any, sendHandle: net.Socket | net.Server) => {
  console.log('Simulation Library thread received message:', message);
  const { command, payload } = message;
  switch (command) {
    case 'load-elf':
      //TODO: Validate inputs
      loadElf(payload.elfPath, payload.toolchainPath, payload.toolchainPrefix, payload.folderPath);
      break;
    case 'advance-pc':
      if (elfIsLoaded) simLib.advance_simulation_with_pc();
      break;
    case 'advance-clock':
      if (elfIsLoaded) simLib.advance_simulation_with_clock();
      break;
  }
});
