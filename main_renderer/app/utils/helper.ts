import * as electron from 'electron';
import * as isDev from 'electron-is-dev';
import * as url from 'url';
import { DataService } from '../services/data.service';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Read the custom property of body section with given name
 * @property name The element to read. E.g. "grey" to read --grey.
 */
export function readStyleProperty(name: string): string {
  const bodyStyles = window.getComputedStyle(document.body);
  return bodyStyles.getPropertyValue('--' + name);
}

export function byteToBinary(num: number, padding: number, bitsInAChunk = 8) {
  if (!num) {
    num = 0;
  }
  let bin = num.toString(2);
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
  while (bin.length < padding) {
    bin = '0' + bin;
  }
  bin = bin.match(new RegExp('.{1,' + bitsInAChunk + '}', 'g')).join(' ');
  return bin.toUpperCase();
}

export function byteToHex(num: number, padding: number) {
  if (!num) {
    num = 0;
  }
  let hex = num.toString(16);
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
  while (hex.length < padding) {
    hex = '0' + hex;
  }
  return hex.toUpperCase();
}

export function range(min, max, step) {
  step = step || 1;
  const input = [];
  for (let i = min; i <= max; i += step) {
    input.push(i);
  }
  return input;
}


// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
const timeouts = [];
const messageName = 'zero-timeout-message';

// Like setTimeout, but only takes a function argument.  There's
// no time argument (always zero) and no arguments (you have to
// use a closure).
export function setZeroTimeout(fn) {
  timeouts.push(fn);
  window.postMessage(messageName, '*');
}

function handleMessage(event) {
  if (event.source == window && event.data == messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      const fn = timeouts.shift();
      fn();
    }
  }
}

window.addEventListener('message', handleMessage, true);

export function cumulativeOffset(element) {
  let top = 0, left = 0;
  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while(element);

  return {
    top: top,
    left: left
  };
}

export function chmodRecursive(folderOrFile, mode = 0o777) {
  const stat = fs.statSync(folderOrFile);

  // Chmod this element
  fs.chmodSync(folderOrFile, mode);

  if(stat.isDirectory()) {
    fs.readdirSync(folderOrFile).forEach((file) => {
      chmodRecursive(path.join(folderOrFile, file))
    });
  }
}

export function openSettingsDialog(dataService: DataService) {
  const child = new electron.remote.BrowserWindow({
    skipTaskbar: true,
    frame: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    parent: electron.remote.getCurrentWindow(),
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  if (isDev) {
    child.loadURL('http://localhost:4200#/settings');
  } else {
    const webPath = url.format({
      pathname: __dirname,
      protocol: 'file:',
      slashes: true,
    });
    child.loadURL(webPath + '/index.html#settings');
  }

  //child.webContents.openDevTools();
  child.once('ready-to-show', () => {
    child.show();
  });
  child.once('close', () => {
    dataService.reloadSettings();
  });
}

export const cpuRegDefinitions = [
  ['zero', 'Fixed Zero'],
  ['ra', 'Return address'],
  ['sp', 'Stack pointer'],
  ['gp', 'Global pointer'],
  ['tp', 'Thread pointer'],
  ['t0', 'Temporary / alternate return address'],
  ['t1', 'Temporary'],
  ['t2', 'Temporary'],
  ['s0', 'Saved register / frame pointer'],
  ['s1', 'Saved register'],
  ['a0', 'Function argument / return value'],
  ['a1', 'Function argument / return value'],
  ['a2', 'Function argument'],
  ['a3', 'Function argument'],
  ['a4', 'Function argument'],
  ['a5', 'Function argument'],
  ['a6', 'Function argument'],
  ['a7', 'Function argument'],
  ['s2', 'Saved register'],
  ['s3', 'Saved register'],
  ['s4', 'Saved register'],
  ['s5', 'Saved register'],
  ['s6', 'Saved register'],
  ['s7', 'Saved register'],
  ['s8', 'Saved register'],
  ['s9', 'Saved register'],
  ['s10', 'Saved register'],
  ['s11', 'Saved register'],
  ['t3', 'Temporary'],
  ['t4', 'Temporary'],
  ['t5', 'Temporary'],
  ['t6', 'Temporary']
];

