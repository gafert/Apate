import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { spawn } from 'child_process';
import { byteToHex } from '../../globals';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { DataService } from '../../core/services/data.service';
import Timeout = NodeJS.Timeout;

declare let CodeMirror: any;

@Component({
  selector: 'app-compile',
  templateUrl: './compile.component.html',
  styleUrls: ['./compile.component.scss']
})
export class CompileComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('fileOptions') fileOptions: ElementRef<HTMLDivElement>;
  @ViewChild('terminalOutputElement') terminalOutputElement: ElementRef<HTMLDivElement>;
  @ViewChild('fileAreaContainer') fileAreaContainer: ElementRef<HTMLDivElement>;
  @ViewChild('codemirrorComponent') codemirrorComponent: CodemirrorComponent;
  /** Set by user to local path or downloaded path */
  public toolchainPath;

  //region Variables

  // Compiling
  /** Set by the user but loads defaults e.g. riscv64-unkown-elf- */
  public toolchainPrefix;
  /** Will be set by the UI */
  public gccSources;
  /** Will be set by the UI but loaded with defaults */
  public gccFlags;
  public gccFlagsDefault = '-O0 -march=rv32i -mabi=ilp32 -Triscv.ld -lgcc -nostdlib -o program.elf';
  /** Not changed by the user */
  public objdumpFlags = '--section .text.init --section .text --section .data --full-contents --disassemble --syms --source -z';
  /** Not changed by the user */
  public readelfFlags = '-a';
  /** True currently compiling */
  public compiling = false;
  /** Text of the terminal */
  public terminalOutput = '';
  /** True if a file with options was clicked */
  public fileOptionsOpen = false;
  /** True if the active file can be saved as is */
  public fileIsSavable = false;

  // File handling
  /** File names in the selected folder */
  public filesInFolder = [];
  /** The active file which is displayed */
  public activeFile;
  /** The file which is selected but its content is not yet displayed */
  public selectedFile;
  /** The default settings the editor uses. Changes in these values to not affect the editor */
  public editorOptions = {
    lineNumbers: true,
    theme: 'dracula',
    mode: 'clike',
    readOnly: false
  };
  /** Holds the editor so settings can be changed */
  public fileContent = '';

  // Editor
  languages = {
    elf: 'plaintext',
    cc: 'cpp',
    cpp: 'cpp',
    hpp: 'cpp',
    hcc: 'cpp',
    hxx: 'cpp',
    c: 'c',
    h: 'c',
    hex: 'plaintext',
    txt: 'plaintext',
    ld: 'plaintext',
    js: 'javascript',
    ts: 'typescript'
  };
  private ngUnsubscribe = new Subject();
  /** Path will be set by the UI */
  private folderPath: string;
  /** Dont save a empty editor file before the real file was loaded in */
  private fileLoadedIntoEditor = false;

  //endregion
  private timeout: Timeout;

  constructor(private changeDetection: ChangeDetectorRef, private dataService: DataService, private ngZone: NgZone) {

  }

  ngOnInit() {
    // Get stored settings
    this.dataService.toolchainPath
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => (this.toolchainPath = value));
    this.dataService.toolchainPrefix
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => (this.toolchainPrefix = value));
    this.dataService.activeFile.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => (this.activeFile = value));
    this.dataService.activeFileIsSaveable.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.fileIsSavable = value;
      this.editorOptions.readOnly = !value;
    });
    this.dataService.folderPath.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.folderPath = value;
      if (this.folderPath) this.reloadFolderContents();
    });

    // Close dialog if somewhere is clicked
    document.addEventListener('click', (event) => {
      if (this.fileOptionsOpen) {
        this.fileOptions.nativeElement.style.display = 'none';
      }
    });

    this.dataService.activeFileContent.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (this.fileContent !== value && value !== null) {
        this.fileContent = value;
        this.fileLoadedIntoEditor = true;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    clearTimeout(this.timeout);
  }

  //region Editor

  ngAfterViewInit() {
    this.dataService.activeFile.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (this.activeFile) {
        const modeObj = this.codemirrorComponent.codeMirrorGlobal.findModeByFileName(value);
        const mode = modeObj ? modeObj.mode : null;
        this.editorOptions.mode = mode;
      }
    });
  }

  fileContentChanged(event) {
    /**
     * This gets called every time the value in the editor is changed.
     * Start a timeout to save the file after 2s of inactivity.
     */

    const save = () => {
      this.fileContentEdited(this.fileContent);
    };

    clearTimeout(this.timeout);
    this.timeout = setTimeout(save, 200);
  }

  //endregion

  //region Folder Management

  clickFile(event, file: string) {
    const txtFiles = ['txt', 's', 'c', 'cc', 'cpp', 'h', 'hpp', 'hh', 'js', 'ts', 'ld'];

    for (const txtFile of txtFiles) {
      if (file.toLowerCase().split('.').pop() === txtFile) {
        // Open as text file
        this.selectedFile = file;
        this.openFileAsText();
        return;
      }
    }

    if (file.toLowerCase().indexOf('.elf') > 0) {
      // Open as objdump, readelf or hex
      // Show dialog
      this.fileOptions.nativeElement.style.display = 'block';
      this.fileOptions.nativeElement.style.top = event.y + 'px';
      this.fileOptions.nativeElement.style.left = event.x + 'px';
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
    fs.readFile(path.join(this.folderPath, this.selectedFile)).then((data) => {
      let tempContent = '';
      const lines = Math.floor(data.length / 16);
      let i = 0;
      for (i = 0; i < lines; i++) {
        for (let j = 0; j < 16; j++) {
          tempContent += byteToHex((data[j + i * 16]), 2);
          if ((j + 1) % 4 === 0) {
            tempContent += ' ';
          }
        }

        tempContent += ' | ';

        for (let j = 0; j < 16; j++) {
          const charCode = data[j + i * 16];
          const char = String.fromCharCode(charCode);
          tempContent += charCode > 32 && charCode < 126 ? char : '.';
        }
        tempContent += '\n';
      }

      let k = 16 * i;
      while (k < data.length) {
        tempContent += byteToHex(data[k], 2);
        if ((k + 1) % 4 === 0) {
          tempContent += ' ';
        }
        k++;
      }

      const space = 16 * (i + 1) - k;

      for (let j = 0; j < space; j++) {
        tempContent += '  ';
        if ((j + 1) % 4 === 0) {
          tempContent += ' ';
        }
      }

      tempContent += ' | ';

      k = 16 * i;
      while (k < data.length) {
        const charCode = data[k];
        const char = String.fromCharCode(charCode);
        tempContent += charCode > 32 && charCode < 126 ? char : '.';
        k++;
      }

      this.dataService.activeFileIsSaveable.next(false);
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileContent.next(tempContent);
      this.changeDetection.detectChanges();
    });
  }

  openFileAsObjectDump() {
    this.dataService.activeFile.next(this.selectedFile);
    let tempContent = '';
    const dump = spawn(
      path.join(this.toolchainPath, this.toolchainPrefix + 'objdump'),
      [...`${this.objdumpFlags} ${this.selectedFile}`.split(' ')],
      { cwd: this.folderPath }
    );
    dump.stdout.on('data', (data) => (tempContent += data));
    dump.stderr.on('data', (data) => (tempContent += data));
    dump.on('error', (err) => console.error('Failed to start objdump', err));
    dump.on('close', (code) => {
      this.terminalOutput += 'objdump exited with code: ' + code + '\n';
      this.dataService.activeFileContent.next(tempContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsReadElf() {
    this.dataService.activeFile.next(this.selectedFile);

    let tempContent = '';
    const readelf = spawn(
      path.join(this.toolchainPath, this.toolchainPrefix + 'readelf'),
      [...`${this.readelfFlags} ${this.selectedFile}`.split(' ')],
      { cwd: this.folderPath }
    );
    readelf.stdout.on('data', (data) => (tempContent += data));
    readelf.stderr.on('data', (data) => (tempContent += data));
    readelf.on('error', (err) => console.error('Failed to start readelf', err));
    readelf.on('close', (code) => {
      this.terminalOutput += 'readelf exited with code: ' + code + '\n';
      this.dataService.activeFileContent.next(tempContent);
      this.dataService.activeFileIsSaveable.next(false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsText() {
    fs.readFile(path.join(this.folderPath, this.selectedFile), { encoding: 'utf-8' }).then((data: string) => {
      this.dataService.activeFile.next(this.selectedFile);
      this.dataService.activeFileIsSaveable.next(true);
      this.dataService.activeFileContent.next(data);
    });
  }

  fileContentEdited(code) {
    if (this.fileIsSavable && this.activeFile && this.folderPath) {
      fs.writeFile(path.join(this.folderPath, this.activeFile), code);
      this.dataService.activeFileContent.next(code);
    }
  }

  reloadFolderContents() {
    if (!this.folderPath) return;
    fs.readdir(this.folderPath).then((files) => {
      const onlyFiles = [];
      for (const file of files) {
        fs.stat(path.join(this.folderPath, file)).then((stats) => {
          if (stats.isFile()) {
            onlyFiles.push(file);
          }
        });
      }
      this.filesInFolder = onlyFiles.sort();
    });
  }

  //endregion

  //region Compile

  compile() {
    if (!this.toolchainPath) {
      this.terminalOutput += 'Toolchain folder not specified!';
      this.scrollTerminaltoBottom();
      return;
    }
    this.compiling = true;
    const gcc = spawn(
      path.join(this.toolchainPath, this.toolchainPrefix + 'gcc'),
      [...`${this.gccSources} ${this.gccFlags}`.split(' ')],
      { cwd: this.folderPath }
    );
    gcc.stdout.on('data', (data) => (this.terminalOutput += data));
    gcc.stderr.on('data', (data) => (this.terminalOutput += data));
    gcc.on('error', (err) => {
      this.compiling = false;
      this.changeDetection.detectChanges();
    });
    gcc.on('close', (code) => {
      this.terminalOutput += 'Compiler exited with code: ' + code + '\n';
      this.reloadFolderContents();
      this.compiling = false;
      this.changeDetection.detectChanges();
      this.scrollTerminaltoBottom();
    });
  }

  //endregion

  scrollTerminaltoBottom() {
    this.terminalOutputElement.nativeElement.scrollTop = this.terminalOutputElement.nativeElement.scrollHeight;
  }
}
