import {Injectable} from '@angular/core';
import {authorize} from "../../utils/google-drive-auth";
import https from "https";
import * as fs from "fs";
import * as zlib from "zlib";
import * as path from "path";
import * as tar from 'tar-fs';
import * as electron from "electron";

const app = electron.remote.app;
import {BehaviorSubject} from "rxjs";
import {DataService} from "./data.service";
import isDev from "electron-is-dev";
import {PathLike} from "fs";

export enum ToolchainDownEnum {
  DOWNLOADING,
  UNZIPPING,
  DOWNLOADED,
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
  private isWin = process.platform === "win32";
  private isMac = process.platform === "darwin";
  private isLinux = process.platform === "linux";

  public toolchainDownloadPath;
  private downloadPath;
  private toolchainDownloadZipFile;

  private toolchainFolder = "riscv64-toolchain";

  public state: BehaviorSubject<ToolchainDownState> =
    new BehaviorSubject<ToolchainDownState>(new ToolchainDownState(ToolchainDownEnum.NOT_DOWNLOADED, ""));

  constructor(private dataService: DataService) {
    this.downloadPath = path.join(app.getPath('userData'), 'downloads');

    // Make new directory if it does not exist
    fs.mkdir(this.downloadPath, null, () => null);

    this.toolchainDownloadZipFile = path.join(this.downloadPath, "riscv.tar.gz");
    this.toolchainDownloadPath =  path.join(this.downloadPath, this.toolchainFolder, "bin");

    dataService.toolchainDownloaded.subscribe((value) => {
      if (value === true) {
        this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADED, "Already Downloaded"))
      }
    });
  }

  public downloadToolchain() {
    let platform;
    if (this.isMac) {
      platform = "mac";
    } else if (this.isLinux) {
      platform = "linux";
    } else if (this.isWin) {
      platform = "win";
    }

    if (!platform) {
      this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, "Unsupported platform"));
      return;
    }

    const query = "name contains 'riscv64-toolchain-" + platform + "'";

    this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADING, 0));
    authorize().then((jwtClient => {
      new Promise<any>((resolveGetId, rejectGetId) => {
        https.request(`https://www.googleapis.com/drive/v3/files?q=${query}`,
          {headers: {'Authorization': 'Bearer ' + jwtClient.credentials.access_token}}, (res => {
            let json = '';
            res.on('data', (chunk) => json += chunk);
            res.on('end', () => resolveGetId(JSON.parse(json)));
          })).on("error", (error) => {
          this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, error.message));
          rejectGetId(error.message);
        }).end();
      }).then((list) => {
        console.log("Files matching query", query, list);
        new Promise((resolve, reject) => {
          https.request(`https://www.googleapis.com/drive/v3/files/${list.files[0].id}?alt=media`,
            {headers: {'Authorization': 'Bearer ' + jwtClient.credentials.access_token,}}, (res => {
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
            })).on("error", (error) => {
            console.log("Error downloading file", error.message);
            reject(error.message);
          }).end();
        }).then(() => {
          this.state.next(new ToolchainDownState(ToolchainDownEnum.UNZIPPING, ""));

          fs.createReadStream(this.toolchainDownloadZipFile).pipe(zlib.createGunzip()).pipe(tar.extract(this.downloadPath)).on('finish', (err) => {
            if (err) {
              this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, err));
              return;
            }

            // Delete downloaded zip after it was unpacked
            fs.unlink(this.toolchainDownloadZipFile, () => null);

            this.dataService.toolchainDownloaded.next(true)
            this.dataService.toolchainPath.next(this.toolchainDownloadPath)
            this.state.next(new ToolchainDownState(ToolchainDownEnum.DOWNLOADED, ""));
          });
        }).catch((reason => {
          this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, reason));
        }))
      }).catch((reason => {
        this.state.next(new ToolchainDownState(ToolchainDownEnum.ERROR, reason));
      }))
    }))
  }

  public removeToolchain() {
    this.deleteFolderRecursive(path.join(this.downloadPath, this.toolchainFolder)).then(() => {
      this.state.next(new ToolchainDownState(ToolchainDownEnum.NOT_DOWNLOADED, "Removed Toolchain from " + this.downloadPath + "/" + this.toolchainFolder));
      this.dataService.toolchainDownloaded.next(false);
    });
  }

  deleteFolderRecursive(folder) {
    return new Promise((resolve, reject) => {
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
      resolve();
    });
  };
}
