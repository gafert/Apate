import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as electron from 'electron';

const app = electron.remote.app;

export function authorize() {
  return new Promise<any>((resolve, reject) => {
    let appPath = path.join(app.getAppPath(), 'dist', 'main_renderer', 'static');
    if (isDev) appPath = path.join(app.getAppPath(), 'main_renderer', 'static');

    console.log('Reading secret from', appPath);

    // Load client secrets from a local file.
    const content = fs.readFileSync(path.join(appPath, 'risc-v-visualisation-5573002e3d2c.json'));

    const privatekey = JSON.parse(String(content));
    // configure a JWT auth client
    const jwtClient = new JWT(privatekey.client_email, null, privatekey.private_key, [
      'https://www.googleapis.com/auth/drive'
    ]);
    // authenticate request
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log('Successfully connected!');
        resolve(jwtClient);
      }
    });
  });
}
