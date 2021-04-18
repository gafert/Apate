import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as https from 'https';
import { DataKeys, DataService } from '../../services/data.service';
import { authorize } from '../../utils/googleDriveAuth';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as path from 'path';
import * as tar from 'tar-fs';
import * as electron from 'electron';
import { HttpClient } from '@angular/common/http';

const app = electron.remote.app;

export enum ToolchainDownEnum {
  DOWNLOADING,
  UNZIPPING,
  DOWNLOADED,
  WAS_DOWNLOADED,
  ERROR,
  NOT_DOWNLOADED
}

export class ToolchainDownState {
  state: ToolchainDownEnum;
  reason: string | number;

  constructor(state: ToolchainDownEnum, reason: string | number) {
    this.state = state;
    this.reason = reason;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToolchainDownloaderService {
  public toolchainDownloadPath;
  public state: BehaviorSubject<ToolchainDownState> = new BehaviorSubject<ToolchainDownState>(new ToolchainDownState(ToolchainDownEnum.NOT_DOWNLOADED, ''));
  private isWin = process.platform === 'win32';
  private isMac = process.platform === 'darwin';
  private isLinux = process.platform === 'linux';
  private downloadPath;
  private toolchainDownloadZipFile;
  private toolchainFolder = 'riscv64-toolchain';

  constructor(private dataService: DataService, private http: HttpClient) {
    this.downloadPath = path.join(app.getPath('userData'), 'downloads');

    // Make new directory if it does not exist
    fs.mkdir(this.downloadPath, null, () => null);

    this.toolchainDownloadZipFile = path.join(this.downloadPath, 'riscv.tar.gz');
    this.toolchainDownloadPath = path.join(this.downloadPath, this.toolchainFolder, 'bin');

    dataService.data[DataKeys.TOOLCHAIN_DOWNLOADED].subscribe((value) => {
      if (value === true) {
        this.state.next(new ToolchainDownState(ToolchainDownEnum.WAS_DOWNLOADED, this.toolchainDownloadPath));
      }
    });
  }

  public downloadToolchain() {
    this.removeToolchain();
    authorize().then(jwtClient => {
      this.getNameOfZipFromGoogleDrive(jwtClient, this.getQueryName()).then((item: any) => {
        this.downloadZipFromGoogleDrive(jwtClient, item).then(() => {
          this.unzip().catch((reason => {
            this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, reason));
          }));
        }).catch((reason => {
          this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, reason));
        }));
      }).catch((reason => {
        this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, reason));
      }));
    });
  }

  private getQueryName() {
    let platform;
    if (this.isMac) {
      platform = 'mac';
    } else if (this.isLinux) {
      platform = 'linux';
    } else if (this.isWin) {
      platform = 'win';
    }

    if (!platform) this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, 'Unsupported platform'));
    this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADING, 0));

    return 'name contains \'riscv64-toolchain-' + platform + '\'';
  }

  private getNameOfZipFromGoogleDrive(jwtClient, query) {
    return this.http.get(`https://www.googleapis.com/drive/v3/files?q=${query}`, {
      headers: { 'Authorization': 'Bearer ' + jwtClient.credentials.access_token },
      reportProgress: true
    }).toPromise().then((list: any) => {
      return list.files[0].id;
    })
  }

  private downloadZipFromGoogleDrive(jwtClient, item): Promise<any> {
    return new Promise((resolve, reject) => {
      https.request(`https://www.googleapis.com/drive/v3/files/${item}?alt=media`,
        { headers: { 'Authorization': 'Bearer ' + jwtClient.credentials.access_token } },
        (res => {
          const writeStream = fs.createWriteStream(this.toolchainDownloadZipFile);
          const len = parseInt(res.headers['content-length'], 10);
          let downloaded = 0;
          res.on('data', (chunk) => {
            downloaded += chunk.length;
            this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADING,
              Number((downloaded / len * 100).toFixed(0))));
            writeStream.write(chunk);
          });
          res.on('end', () => resolve());
        })).on('error', (error) => {
        console.log('Error downloading file', error.message);
        reject(error.message);
      }).end();
    });
  }

  private unzip(): Promise<any> {
    return new Promise(((resolve, reject) => {
      this.state.next(new ToolchainDownState(ToolchainDownEnum.UNZIPPING, ''));
      fs.createReadStream(this.toolchainDownloadZipFile).pipe(zlib.createGunzip()).pipe(tar.extract(this.downloadPath)).on('finish', (err) => {
        if (err) {
          this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, err));
          reject(err);
          return;
        }
        // Delete downloaded zip after it was unpacked
        fs.unlink(this.toolchainDownloadZipFile, () => null);

        this.dataService.data[DataKeys.TOOLCHAIN_DOWNLOADED].next(true);
        this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADED, this.toolchainDownloadPath));
        resolve();
      });
    }))
  }

  public removeToolchain() {
    this.deleteFolderRecursive(path.join(this.downloadPath, this.toolchainFolder));
    console.log('Removed toolchain ' + this.downloadPath + '/' + this.toolchainFolder);
    this.state.next(new ToolchainDownState(ToolchainDownEnum.NOT_DOWNLOADED, 'Removed Toolchain from ' + this.downloadPath + '/' + this.toolchainFolder));
    this.dataService.data[DataKeys.TOOLCHAIN_DOWNLOADED].next(false);
  }

  private deleteFolderRecursive(folder) {
    if (fs.existsSync(folder)) {
      fs.readdirSync(folder).forEach((file, index) => {
        const curPath = path.join(folder, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folder);
    }
  }
}
