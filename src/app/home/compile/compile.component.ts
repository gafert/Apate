import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {spawn} from "child_process";
import {byteToHex} from "../../globals";
import * as fs from "fs";
import * as electron from "electron";
import {DataService, ToolchainDownEnum, ToolchainDownloaderService} from "../../core/services";

const app = electron.remote.app;

@Component({
  selector: 'app-compile',
  templateUrl: './compile.component.html',
  styleUrls: ['./compile.component.scss']
})
export class CompileComponent {
  @ViewChild('fileOptions') fileOptions: ElementRef<HTMLDivElement>;
  @ViewChild('toolchainPathOptions') toolchainPathOptions: ElementRef<HTMLDivElement>;

  //region Variables
  /** Set by user to local path or downloaded path */
  public toolchainPath;
  /** Set by the user but loads defaults e.g. riscv64-unkown-elf- */
  public toolchainPrefix;
  public toolchainPrefixDefault = "riscv64-unknown-elf-";
  /** Path will be set by the UI */
  private folderPath: string;
  /** Will be set by the UI */
  public gccSources;
  /** Will be set by the UI but loaded with defaults */
  public gccFlags;
  public gccFlagsDefault = "-O0 -march=rv32i -mabi=ilp32 -Triscv.ld -lgcc -nostdlib -o program.elf";
  /** Not changed by the user */
  public objdumpFlags = "--section .text.init --section .text --section .data --full-contents --disassemble --syms --source -z";
  /** Not changed by the user */
  public readelfFlags = "-a";
  /** True if a file with options was clicked */
  public fileOptionsOpen = false;
  /** True if the toolchain was clicked */
  public toolchainPathOptionsOpen = false;
  /** True currently compiling */
  public compiling = false;
  /** True if the active file can be saved as is */
  public fileIsSavable = false;
  /** File names in the selected folder */
  public filesInFolder = [];
  /** Text of the terminal */
  public terminalOutput = "";
  /** The content of the active file */
  public fileContent;
  /** The active file which is displayed */
  public activeFile;
  /** The file which is selected but its content is not yet displayed */
  public selectedFile;

  public toolchainPercentDownloaded = 0;
  public toolchainDownloaderState = ToolchainDownEnum.NOT_DOWNLOADED;
  public ToolchainDownEnum = ToolchainDownEnum;

  //endregion
  constructor(private changeDetection: ChangeDetectorRef,
              private dataService: DataService,
              private toolchainDownloaderService: ToolchainDownloaderService) {
    // Get stored settings
    dataService.toolchainPath.subscribe((value) => this.toolchainPath = value);
    dataService.folderPath.subscribe((value) => {
      this.folderPath = value;
      this.reloadFolderContents();
    });

    dataService.activeFile.subscribe((value) => this.activeFile = value);
    dataService.activeFileContent.subscribe((value) => this.fileContent = value);
    dataService.activeFileIsSaveable.subscribe((value) => this.fileIsSavable = value);

    this.toolchainDownloaderService.state.subscribe((state) => {
      switch (state.state) {
        case ToolchainDownEnum.DOWNLOADING:
          this.toolchainPercentDownloaded = state.reason as number;
      }
      this.toolchainDownloaderState = state.state;
      console.log("New toolchainDownloaderState", state)
    })

    if (this.folderPath) this.reloadFolderContents();
    document.addEventListener('click', (event) => {
      if (this.fileOptionsOpen) {
        this.fileOptions.nativeElement.style.display = "none";
      }
      if (this.toolchainPathOptionsOpen) {
        this.toolchainPathOptions.nativeElement.style.display = "none";
      }
    })
  }

  //region Folder Management

  clickFile(event, file: string) {
    let txtFiles = ['.c', '.txt', '.s', '.c', '.cc', '.cpp', '.h', '.hpp', '.hh', '.js', '.ts', '.ld'];

    for (let txtFile of txtFiles) {
      if (file.toLowerCase().indexOf(txtFile) > 0) {
        // Open as text file
        this.selectedFile = file;
        this.openFileAsText();
        return;
      }
    }

    if (file.toLowerCase().indexOf('.elf') > 0) {
      // Open as objdump, readelf or hex
      // Show dialog
      this.fileOptions.nativeElement.style.display = "block";
      this.fileOptions.nativeElement.style.top = event.y + "px";
      this.fileOptions.nativeElement.style.left = event.x + "px";
      this.fileOptionsOpen = true;
      this.selectedFile = file;
      event.stopPropagation();
      return;
    }

    if (file.toLowerCase().indexOf('.hex') > 0) {
      // Open as hex
      this.selectedFile = file;
      this.openFileAsHexDump();
      return;
    }

    console.log("Dont know file", file);
  }

  openFileAsHexDump() {
    fs.readFile(this.folderPath + "/" + this.selectedFile, {}, ((err, data) => {
      this.fileContent = "";
      const lines = Math.floor(data.length / 16);
      let i = 0;
      for (i = 0; i < lines; i++) {
        for (let j = 0; j < 16; j++) {
          this.fileContent += byteToHex(data[j + (i * 16)], 2);
          if ((j + 1) % 4 === 0) {
            this.fileContent += " "
          }
        }

        this.fileContent += " | ";

        for (let j = 0; j < 16; j++) {
          const charCode = data[j + (i * 16)];
          const char = String.fromCharCode(charCode);
          this.fileContent += (charCode > 32 && charCode < 126) ? char : '.';
        }
        this.fileContent += '\n';
      }

      let k = 16 * i;
      while (k < data.length) {
        this.fileContent += byteToHex(data[k], 2);
        if ((k + 1) % 4 === 0) {
          this.fileContent += " "
        }
        k++;
      }

      let space = 16 * (i + 1) - k;

      for (let j = 0; j < space; j++) {
        this.fileContent += "  ";
        if ((j + 1) % 4 === 0) {
          this.fileContent += " "
        }
      }

      this.fileContent += " | ";

      k = 16 * i;
      while (k < data.length) {
        const charCode = data[k];
        const char = String.fromCharCode(charCode);
        this.fileContent += (charCode > 32 && charCode < 126) ? char : '.';
        k++;
      }

      this.dataService.activeFileIsSaveable.next(false);
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileContent.next(this.fileContent);
      this.changeDetection.detectChanges();
    }))
  }

  openFileAsObjectDump() {
    this.dataService.activeFile.next(this.selectedFile);
    this.fileContent = "";
    const dump = spawn(`${this.toolchainPath}/${this.toolchainPrefix}objdump`, [...`${this.objdumpFlags} ${this.selectedFile}`.split(' ')], {cwd: this.folderPath});
    dump.stdout.on('data', (data) => this.fileContent += data + '\n');
    dump.stderr.on('data', (data) => this.fileContent += data + '\n');
    dump.on('error', (err) => console.error('Failed to start objdump', err));
    dump.on('close', (code) => {
      this.terminalOutput += "objdump exited with code: " + code + '\n';
      this.dataService.activeFileContent.next(this.fileContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
    });
  }

  openFileAsReadElf() {
    this.dataService.activeFile.next(this.selectedFile);
    this.fileContent = "";
    const readelf = spawn(`${this.toolchainPath}/${this.toolchainPrefix}readelf`, [...`${this.readelfFlags} ${this.selectedFile}`.split(' ')], {cwd: this.folderPath});
    readelf.stdout.on('data', (data) => this.fileContent += data + '\n');
    readelf.stderr.on('data', (data) => this.fileContent += data + '\n');
    readelf.on('error', (err) => console.error('Failed to start readelf', err));
    readelf.on('close', (code) => {
      this.terminalOutput += ("readelf exited with code: " + code + '\n');
      this.dataService.activeFileContent.next(this.fileContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
    });
  }

  openFileAsText() {
    fs.readFile(this.folderPath + "/" + this.selectedFile, {encoding: 'utf-8'}, ((err, data) => {
      this.fileContent = data;
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileContent.next(this.fileContent);
      this.dataService.activeFileIsSaveable.next(true);
      this.changeDetection.detectChanges();
    }))
  }

  fileContentChanged() {
    console.log("Content changed");
    if (this.fileIsSavable && this.activeFile && this.folderPath) {
      fs.writeFile(this.folderPath + "/" + this.activeFile, this.fileContent,
        ((err) => err ? console.log(err) : null));
      this.dataService.activeFileContent.next(this.fileContent);
    }
  }

  reloadFolderContents() {
    if(!this.folderPath) {
      return;
    }
    new Promise((resolve => {
      fs.readdir(this.folderPath, (err, files) => {
        if (err) {
          console.log("File Error", err);
          return;
        }
        let onlyFiles = [];
        for (let file of files) {
          let stats = fs.statSync(this.folderPath + "/" + file);
          if (stats.isFile()) {
            onlyFiles.push(file);
          }
        }
        onlyFiles = onlyFiles.sort();
        resolve(onlyFiles);
      });
    })).then(((value: []) => {
      this.filesInFolder = value;
    }))
  }

  //endregion

  //region Toolchain
  clickToolchainPath(event) {
    this.toolchainPathOptions.nativeElement.style.display = "block";
    this.toolchainPathOptions.nativeElement.style.top = event.y + "px";
    this.toolchainPathOptions.nativeElement.style.left = event.x + "px";
    this.toolchainPathOptionsOpen = true;
    event.stopPropagation();
  }

  openToolchainPathDialog() {
    electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((result) => {
      if (!result.canceled) {
        this.toolchainPath = result.filePaths[0];
        this.dataService.toolchainPath.next(this.toolchainPath);
      }
    })
  }

  downloadToolchain() {
    this.toolchainDownloaderService.downloadToolchain();
  }

  useDownloadedToolchain() {
    this.toolchainPath = this.toolchainDownloaderService.toolchainDownloadPath;
    this.dataService.toolchainPath.next(this.toolchainPath);
  }
  //endregion

  compile() {
    this.compiling = true;
    const gcc = spawn(`${this.toolchainPath}/${this.toolchainPrefix}gcc`, [...`${this.gccSources} ${this.gccFlags}`.split(' ')], {cwd: this.folderPath});
    gcc.stdout.on('data', (data) => this.terminalOutput += data + '\n');
    gcc.stderr.on('data', (data) => this.terminalOutput += data + '\n');
    gcc.on('error', (err) => {
      console.error('Failed to start gcc', err);
      this.compiling = false;
    });
    gcc.on('close', (code) => {
      this.terminalOutput += "Compiler exited with code: " + code + '\n';
      this.reloadFolderContents();
      this.compiling = false;
    });
  }
}
