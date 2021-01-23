import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');
let wizardSettings;

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  wizardSettings = {
    x: Math.floor(size.width / 2 - 700 / 2),
    y: Math.floor(size.height / 2 - 500 / 2),
    width: 700,
    height: 500,
    resizable: false,
    maximizable: false,
    fullscreenable: false
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: wizardSettings.x,
    y: wizardSettings.y,
    width: wizardSettings.width,
    height: wizardSettings.height,
    maximizable: wizardSettings.maximizable,
    resizable: wizardSettings.resizable,
    fullscreenable: wizardSettings.fullscreenable,
    backgroundColor: '#1a1b1c',
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      allowRunningInsecureContent: serve
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


  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

ipcMain.on('main-window-home', (event, arg) => {
  const display = screen.getPrimaryDisplay();
  const maxSize = display.workAreaSize;
  mainWindow.setPosition(0,0);
  mainWindow.setSize(maxSize.width, maxSize.height);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.setFullScreenable(true);
})

ipcMain.on('main-window-wizard', (event, arg) => {
  console.log(wizardSettings);
  mainWindow.setPosition(wizardSettings.x,wizardSettings.y);
  mainWindow.setSize(wizardSettings.width, wizardSettings.height);
  mainWindow.setResizable(wizardSettings.resizable);
  mainWindow.setMaximizable(wizardSettings.maximizable);
  mainWindow.setFullScreenable(wizardSettings.fullscreenable);
})

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
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
