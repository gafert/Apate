import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {spawn} from "child_process";
import {byteToHex} from "../../globals";
import * as fs from "fs";
import * as electron from "electron";
import {DataService, ToolchainDownEnum, ToolchainDownloaderService} from "../../core/services";
import * as path from "path";

const app = electron.remote.app;

@Component({
  selector: 'app-compile',
  templateUrl: './compile.component.html',
  styleUrls: ['./compile.component.scss']
})
export class CompileComponent implements AfterViewInit {
  @ViewChild('fileOptions') fileOptions: ElementRef<HTMLDivElement>;
  @ViewChild('fileTextArea') fileTextArea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('terminalOutputElement') terminalOutputElement: ElementRef<HTMLDivElement>;

  //region Variables
  /** Set by user to local path or downloaded path */
  public toolchainPath;
  /** Set by the user but loads defaults e.g. riscv64-unkown-elf- */
  public toolchainPrefix;
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
  /** True currently compiling */
  public compiling = false;
  /** True if the active file can be saved as is */
  public fileIsSavable = false;
  /** File names in the selected folder */
  public filesInFolder = [];
  /** Text of the terminal */
  public terminalOutput = "";
  /** The active file which is displayed */
  public activeFile;
  /** The file which is selected but its content is not yet displayed */
  public selectedFile;

  public lineNumbers;

  //endregion
  constructor(private changeDetection: ChangeDetectorRef,
              private dataService: DataService) {
    // Get stored settings
    this.dataService.toolchainPath.subscribe((value) => this.toolchainPath = value);
    this.dataService.folderPath.subscribe((value) => {
      this.folderPath = value;
      if (this.folderPath) this.reloadFolderContents();
    });
    this.dataService.toolchainPrefix.subscribe((value) => this.toolchainPrefix = value);
    this.dataService.activeFile.subscribe((value) => this.activeFile = value);

    this.dataService.activeFileIsSaveable.subscribe((value) => this.fileIsSavable = value);

    document.addEventListener('click', (event) => {
      if (this.fileOptionsOpen) {
        this.fileOptions.nativeElement.style.display = "none";
      }
    });

    this.dataService.activeFileContent.subscribe((value) => {
      this.setLineNumbers(this.getTextareaNumberOfLines(value));
    });
  }

  ngAfterViewInit(): void {
    // Why a delay? I dont know
    // Without the delay the text is not set into the textarea
    // And first time takes longer? Dont ask
    setTimeout(() => {
      this.dataService.activeFileContent.subscribe((value) => {
        this.setTextAreaContent(value);
      });
    }, 500);
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
  }

  openFileAsHexDump() {
    fs.readFile(path.join(this.folderPath, this.selectedFile), {}, ((err, data) => {
      let tempContent = "";
      const lines = Math.floor(data.length / 16);
      let i = 0;
      for (i = 0; i < lines; i++) {
        for (let j = 0; j < 16; j++) {
          tempContent += byteToHex(data[j + (i * 16)], 2);
          if ((j + 1) % 4 === 0) {
            tempContent += " "
          }
        }

        tempContent += " | ";

        for (let j = 0; j < 16; j++) {
          const charCode = data[j + (i * 16)];
          const char = String.fromCharCode(charCode);
          tempContent += (charCode > 32 && charCode < 126) ? char : '.';
        }
        tempContent += '\n';
      }

      let k = 16 * i;
      while (k < data.length) {
        tempContent += byteToHex(data[k], 2);
        if ((k + 1) % 4 === 0) {
          tempContent += " "
        }
        k++;
      }

      let space = 16 * (i + 1) - k;

      for (let j = 0; j < space; j++) {
        tempContent += "  ";
        if ((j + 1) % 4 === 0) {
          tempContent += " "
        }
      }

      tempContent += " | ";

      k = 16 * i;
      while (k < data.length) {
        const charCode = data[k];
        const char = String.fromCharCode(charCode);
        tempContent += (charCode > 32 && charCode < 126) ? char : '.';
        k++;
      }

      this.dataService.activeFileIsSaveable.next(false);
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileContent.next(tempContent);
      this.changeDetection.detectChanges();
    }))
  }

  openFileAsObjectDump() {
    this.dataService.activeFile.next(this.selectedFile);
    let tempContent = "";
    const dump = spawn(path.join(this.toolchainPath, this.toolchainPrefix + "objdump"), [...`${this.objdumpFlags} ${this.selectedFile}`.split(' ')], {cwd: this.folderPath});
    dump.stdout.on('data', (data) => tempContent += data);
    dump.stderr.on('data', (data) => tempContent += data);
    dump.on('error', (err) => console.error('Failed to start objdump', err));
    dump.on('close', (code) => {
      this.terminalOutput += "objdump exited with code: " + code + '\n';
      this.dataService.activeFileContent.next(tempContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsReadElf() {
    this.dataService.activeFile.next(this.selectedFile);

    let tempContent = "";
    const readelf = spawn(path.join(this.toolchainPath, this.toolchainPrefix + "readelf"), [...`${this.readelfFlags} ${this.selectedFile}`.split(' ')], {cwd: this.folderPath});
    readelf.stdout.on('data', (data) => tempContent += data);
    readelf.stderr.on('data', (data) => tempContent += data);
    readelf.on('error', (err) => console.error('Failed to start readelf', err));
    readelf.on('close', (code) => {
      this.terminalOutput += ("readelf exited with code: " + code + '\n');
      this.dataService.activeFileContent.next(tempContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsText() {
    fs.readFile(path.join(this.folderPath, this.selectedFile), {encoding: 'utf-8'}, ((err, data) => {
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileIsSaveable.next(true);
      this.dataService.activeFileContent.next(data);
      this.changeDetection.detectChanges();
    }))
  }

  fileContentEdited(event) {
    if (this.fileIsSavable && this.activeFile && this.folderPath) {
      fs.writeFile(path.join(this.folderPath, this.activeFile), event.target.value,
        ((err) => err ? console.log(err) : null));
      this.dataService.activeFileContent.next(event.target.value);
    }
  }

  reloadFolderContents() {
    if (!this.folderPath) {
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
          let stats = fs.statSync(path.join(this.folderPath, file));
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

  compile() {
    if(!this.toolchainPath) {
      this.terminalOutput += "Toolchain folder not specified!";
      this.scrollTerminaltoBottom();
      return;
    }
    this.compiling = true;
    const gcc = spawn(path.join(this.toolchainPath, this.toolchainPrefix + "gcc"), [...`${this.gccSources} ${this.gccFlags}`.split(' ')], {cwd: this.folderPath});
    gcc.stdout.on('data', (data) => this.terminalOutput += data);
    gcc.stderr.on('data', (data) => this.terminalOutput += data);
    gcc.on('error', (err) => {
      this.compiling = false;
      this.changeDetection.detectChanges();
    });
    gcc.on('close', (code) => {
      this.terminalOutput += "Compiler exited with code: " + code + '\n';
      this.reloadFolderContents();
      this.compiling = false;
      this.changeDetection.detectChanges();
      this.scrollTerminaltoBottom();
    });
  }

  setLineNumbers(numberOfLines) {
    this.lineNumbers = "";
    for (let i = 0; i < numberOfLines; i++) {
      this.lineNumbers += "" + i + "\n";
    }
  }

  getTextareaNumberOfLines(content) {
    if(!content) return 0;
    return content.split(/\r\n|\r|\n/).length;
  }

  setTextAreaContent(content) {
    if(content) {
      this.fileTextArea.nativeElement.value = content;
        this.fileTextArea.nativeElement.style.height = "auto";
      this.fileTextArea.nativeElement.style.height = (this.fileTextArea.nativeElement.scrollHeight) + 'px';
    }
  }

  scrollTerminaltoBottom() {
    this.terminalOutputElement.nativeElement.scrollTop = this.terminalOutputElement.nativeElement.scrollHeight;
  }
}
