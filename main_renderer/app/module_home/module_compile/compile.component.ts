import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {spawn} from 'child_process';
import {byteToHex, readStyleProperty} from '../../utils/helper';
// @ts-ignore
import DEMO from 'raw-loader!../../utils/helper';
import * as fs from 'fs';
import * as path from 'path';
import {DataKeys, DataService} from '../../services/data.service';
import {ProjectService, ProjectSettings} from '../../services/project.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import Timeout = NodeJS.Timeout;
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService, MonacoStandaloneCodeEditor
} from "@materia-ui/ngx-monaco-editor";
import {filter, skipWhile, take, takeUntil, takeWhile} from "rxjs/operators";
import * as electronIsDev from "electron-is-dev";
import * as electron from 'electron';
import {BehaviorSubject, fromEvent} from "rxjs";

const app = electron.remote.app;

@Component({
  selector: 'app-compile',
  templateUrl: './compile.component.html',
  styleUrls: ['./compile.component.scss']
})
@UntilDestroy()
export class CompileComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('fileOptions') fileOptions: ElementRef<HTMLDivElement>;
  @ViewChild('terminalOutputElement') terminalOutputElement: ElementRef<HTMLDivElement>;
  @ViewChild(MonacoEditorComponent) monacoComponent: MonacoEditorComponent;

  public readonly DataKeys = DataKeys;

  // Compiling
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
  /** Holds the editor so settings can be changed */
  public fileContent = '';

  /** Path will be set by the UI */
  private folderPath: string;
  /** Dont save a empty editor file before the real file was loaded in */
  private fileLoadedIntoEditor = false;
  private fileSaveTimeout: Timeout;

  public editorOptions: MonacoEditorConstructionOptions = {
    theme: "myCustomTheme",
    roundedSelection: true,
    autoIndent: "full"
  };
  private editorLanguages = {
    cc: 'cpp',
    cpp: 'cpp',
    hpp: 'cpp',
    hcc: 'cpp',
    hxx: 'cpp',
    c: 'c',
    h: 'c',
    js: 'javascript',
    ts: 'typescript',
    json: 'json'
  };
  private filesToOpenInEditor = ['txt', 's', 'c', 'cc', 'cpp', 'h', 'hpp', 'hh', 'js', 'ts', 'ld', 'json'];

  private viewInitiated = new BehaviorSubject(false);

  constructor(private changeDetection: ChangeDetectorRef, private dataService: DataService, private projectService: ProjectService, private monacoLoaderService: MonacoEditorLoaderService) {
    if (electronIsDev) {
      // In development this path is different
      this.monacoLoaderService.monacoPath = path.join(app.getAppPath(), 'node_modules', 'monaco-editor', 'min', 'vs');
    }

    this.monacoLoaderService.isMonacoLoaded$.pipe(filter(isLoaded => isLoaded), take(1)).subscribe(() => {
      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark", // can also be vs or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [],
        colors: {
          "editor.background": readStyleProperty('grey3'),
        }
      });
    });
  }

  ngOnInit() {
    // Subscribe to all angular dependant elements
    this.dataService.data[DataKeys.ACTIVE_FILE_IS_SAVEABLE].pipe(untilDestroyed(this)).subscribe((value) => this.fileIsSavable = value);
    this.dataService.data[DataKeys.ACTIVE_FILE].pipe(untilDestroyed(this)).subscribe((value) => (this.activeFile = value));
    this.dataService.data[DataKeys.PROJECT_PATH].pipe(untilDestroyed(this)).subscribe((value) => {
      this.folderPath = value;
      if (this.folderPath) this.reloadFolderContents();
    });
    this.dataService.data[DataKeys.ACTIVE_FILE_CONTENT].pipe(untilDestroyed(this)).subscribe((value) => {
      if (this.fileContent !== value && value !== null) {
        this.fileContent = value;
        this.fileLoadedIntoEditor = true;
      }
    });


    // Close dialog if somewhere is clicked
    fromEvent(document, 'click').pipe(untilDestroyed(this)).subscribe((event) => {
      if (this.fileOptionsOpen) this.fileOptions.nativeElement.style.display = 'none';
    });
  }

  ngOnDestroy() {
    clearTimeout(this.fileSaveTimeout);
  }

  ngAfterViewInit() {
    this.viewInitiated.next(true);
  }

  editorInit() {
    // Subscribe to all elements which are editor specific
    this.viewInitiated.pipe(
      untilDestroyed(this),
      skipWhile((viewInitiated) => viewInitiated === false),
      take(1)).subscribe(() => {
      this.dataService.data[DataKeys.ACTIVE_FILE].pipe(untilDestroyed(this)).subscribe((value) => {
        if (this.activeFile) {
          const ending = value.split('.').pop();
          let langId = this.editorLanguages[ending];
          if (!langId) langId = "plaintext";
          monaco.editor.setModelLanguage(this.monacoComponent.editor.getModel(), langId);
        }
      });
      this.dataService.data[DataKeys.ACTIVE_FILE_IS_SAVEABLE].pipe(untilDestroyed(this)).subscribe((value) => {
        this.monacoComponent.editor.updateOptions({ readOnly: !value })
      });
    })
  }

  fileContentChanged(event) {
    this.fileContent = event;
    /**
     * This gets called every time the value in the editor is changed.
     * Start a timeout to save the file after 2s of inactivity.
     */

    const save = () => {
      this.fileContentEdited(this.fileContent);
    };

    clearTimeout(this.fileSaveTimeout);
    this.fileSaveTimeout = setTimeout(save, 200);
  }

  clickFile(event, file: string) {
    for (const txtFile of this.filesToOpenInEditor) {
      const fileEnding = file.toLowerCase().split('.').pop();
      if (fileEnding === txtFile) {
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
    const data = fs.readFileSync(path.join(this.folderPath, this.selectedFile));

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

    this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);
    this.dataService.setSetting(DataKeys.ACTIVE_FILE, this.selectedFile);
    this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, tempContent);
  }

  openFileAsObjectDump() {
    this.dataService.data[DataKeys.ACTIVE_FILE].next(this.selectedFile);
    let tempContent = '';
    const dump = spawn(
      path.join(this.dataService.getSetting(DataKeys.TOOLCHAIN_PATH), this.dataService.getSetting(DataKeys.TOOLCHAIN_PREFIX) + 'objdump'),
      [...`${this.dataService.getSetting(DataKeys.OBJDUMP_FLAGS)} ${this.selectedFile}`.split(' ')],
      {cwd: this.folderPath}
    );
    dump.stdout.on('data', (data) => (tempContent += data));
    dump.stderr.on('data', (data) => (tempContent += data));
    dump.on('error', (err) => console.error('Failed to start objdump', err));
    dump.on('close', (code) => {
      this.terminalOutput += 'objdump exited with code: ' + code + '\n';
      this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, tempContent);
      this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsReadElf() {
    this.dataService.setSetting(DataKeys.ACTIVE_FILE, this.selectedFile);

    let tempContent = '';
    const readelf = spawn(
      path.join(this.dataService.getSetting(DataKeys.TOOLCHAIN_PATH), this.dataService.getSetting(DataKeys.TOOLCHAIN_PREFIX) + 'readelf'),
      [...`${this.dataService.getSetting(DataKeys.READ_ELF_FLAGS)} ${this.selectedFile}`.split(' ')],
      {cwd: this.folderPath}
    );
    readelf.stdout.on('data', (data) => (tempContent += data));
    readelf.stderr.on('data', (data) => (tempContent += data));
    readelf.on('error', (err) => console.error('Failed to start readelf', err));
    readelf.on('close', (code) => {
      this.terminalOutput += 'readelf exited with code: ' + code + '\n';
      this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, tempContent);
      this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);
      this.changeDetection.detectChanges();
      this.reloadFolderContents();
      this.scrollTerminaltoBottom();
    });
  }

  openFileAsText() {
    const data = fs.readFileSync(path.join(this.folderPath, this.selectedFile), {encoding: 'utf-8'});
    this.dataService.setSetting(DataKeys.ACTIVE_FILE, this.selectedFile);
    this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, true);
    this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, data);
  }

  fileContentEdited(code) {
    if (this.fileIsSavable && this.activeFile && this.folderPath) {
      fs.writeFileSync(path.join(this.folderPath, this.activeFile), code);
      this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, code);
    }
  }

  reloadFolderContents() {
    if (!this.folderPath) return;
    const files = fs.readdirSync(this.folderPath);

    const onlyFiles = [];
    for (const file of files) {
      const stats = fs.statSync(path.join(this.folderPath, file));
      if (stats.isFile()) {
        onlyFiles.push(file);
      }
    }

    this.filesInFolder = onlyFiles.sort((a, b) => a.localeCompare(b));
  }

  compile() {
    if (!this.dataService.getSetting(DataKeys.TOOLCHAIN_PATH)) {
      this.terminalOutput += 'Toolchain folder not specified! Go to settings to specify\n';
      this.scrollTerminaltoBottom();
      return;
    }
    this.compiling = true;
    const gcc = spawn(
      path.join(this.dataService.getSetting(DataKeys.TOOLCHAIN_PATH), this.dataService.getSetting(DataKeys.TOOLCHAIN_PREFIX) + 'gcc'),
      [...`${this.projectService.getSetting(ProjectSettings.SOURCES)} ${this.projectService.getSetting(ProjectSettings.GCC_FLAGS)}`.split(' ')],
      {cwd: this.folderPath}
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

  scrollTerminaltoBottom() {
    this.terminalOutputElement.nativeElement.scrollTop = this.terminalOutputElement.nativeElement.scrollHeight;
  }
}
