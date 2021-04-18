import { app, BrowserWindow, ipcMain, protocol, screen } from 'electron';
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
    y: Math.floor(size.height / 2 - 510 / 2),
    width: 700,
    height: 510,
    resizable: true, // This prevents maximize minimize events so dont use it
    maximizable: true, // This prevents maximize minimize events so dont use it
    fullscreenable: true // This prevents maximize minimize events so dont use it
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
    backgroundColor: '#1a1a1a',
    frame: false,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: !serve, // Used to load monaco files
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

ipcMain.on('main-window-home', (event, arg) => {
  const display = screen.getPrimaryDisplay();
  const maxSize = display.workAreaSize;
  const w = Math.floor(maxSize.width * 0.9);
  const h = Math.floor(maxSize.height - (maxSize.width * 0.1));
  mainWindow.setPosition(Math.floor(maxSize.width / 2 - w / 2), Math.floor(maxSize.height / 2 - h / 2));
  mainWindow.setSize(w, h);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.setFullScreenable(true);
})

ipcMain.on('main-window-wizard', (event, arg) => {
  mainWindow.setPosition(wizardSettings.x, wizardSettings.y);
  mainWindow.setSize(wizardSettings.width, wizardSettings.height);
  mainWindow.setResizable(wizardSettings.resizable);
  mainWindow.setMaximizable(wizardSettings.maximizable);
  mainWindow.setFullScreenable(wizardSettings.fullscreenable);
})

try {
  app.on('ready', () => {
    if(serve) {
      // Monaco editor is loaded from files and needs access
      protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = request.url.replace('file:///', '');
        callback(pathname);
      });
    }
    createWindow();
  });

  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });
} catch (e) {

}
