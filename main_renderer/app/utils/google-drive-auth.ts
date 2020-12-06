import { google } from 'googleapis';
import * as fs from 'fs';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as electron from 'electron';

const app = electron.remote.app;

export function authorize() {
  return new Promise<any>((resolve) => {
    let appPath = path.join(app.getAppPath(), 'dist', 'static');
    if (isDev) {
      appPath = path.join(app.getAppPath(), 'main_renderer', 'static');
    }
    console.log('Reading secret from', appPath);

    // Load client secrets from a local file.
    fs.readFile(path.join(appPath, 'risc-v-visualisation-5573002e3d2c.json'), (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      const privatekey = JSON.parse(String(content));
      // configure a JWT auth client
      const jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, [
        'https://www.googleapis.com/auth/drive',
      ]);
      // authenticate request
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('Successfully connected!');
          resolve(jwtClient);
        }
      });
    });
  });
}
