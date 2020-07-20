import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import {fork} from 'child_process';
import * as net from "net";
import * as isDev from "electron-is-dev";

let simulationProcess;
let mainWindow: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function sendWindowMessage(targetWindow, message, payload) {
  if (!targetWindow) {
    console.log('Target window does not exist');
    return;
  }
  targetWindow.webContents.send(message, payload);
}

function sendProcessMessage(process, command, payload) {
  process.send({
    command: command,
    payload: payload
  })
}

function startSimulationLibrary() {
  // Pass app path to the forked process
  // This is where settings and the library will reside
  const appPath = `--appPath=${isDev ? app.getAppPath() : process.resourcesPath}`;
  const simulationLibraryPath =  serve ? './dist/simulation_library_worker/bundle.js' : path.join(__dirname, 'dist/simulation_library_worker/bundle.js');
  simulationProcess = fork(simulationLibraryPath,  [appPath]);
  simulationProcess.on('message',  (message: any, sendHandle: net.Socket | net.Server) => {
    console.log("Message from simulation_library", message);
    sendWindowMessage(mainWindow, 'simulation-library', message);
  });
  simulationProcess.on('exit', (code, signal) => {
    console.log(code, signal);
  })
}

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      allowRunningInsecureContent: serve ? true : false
    }
  });

  if (serve) {
    // Timeout is required so fs async apis work
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:4200');
    }, 100);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/main_renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (!serve) {
    // Fail operational
    // Reload window if the render error crashes in production build
    mainWindow.webContents.on('crashed', () => {
      mainWindow.destroy();
      createWindow();
    });
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });


  ipcMain.on('simulation-command', (event, arg) => {
    console.log('simulation-command from angular', arg);
    sendProcessMessage(simulationProcess, arg.command, arg.payload);
  });

  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}


try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    startSimulationLibrary();
    createWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
