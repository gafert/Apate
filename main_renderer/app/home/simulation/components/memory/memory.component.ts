import { AfterViewInit, Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { byteToHex, range } from '../../../../globals';
import { CPUService } from '../../services/cpu.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { INSTRUCTIONS_DESCRIPTIONS, OPCODES } from '../../../../utils/instructionParser';
import { CPU_STATES } from '../../services/bindingSubjects';
import { SimulationComponent } from '../../simulation.component';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit, OnDestroy, AfterViewInit {
  public byteToHex = byteToHex;
  private ngUnsubscribe = new Subject();

  // Memory Buffer
  public memory = null;

  // Used by *ngFor, created here to prevent regeneration
  public memoryElements;

  // Control of values are decimal or hex
  public addressAsDecimal = false;
  public dataAsDecimal = false;

  // Address currently used, is null if memory is not used
  public address = null;

  // Infos of current instruction / what the memory is doing
  public topInfo;
  public leftInfo;
  public rightInfo;

  @ViewChild('scroll') scroll: VirtualScrollerComponent;

  constructor(public cpu: CPUService, @Optional() public simulationComponent: SimulationComponent) {
    cpu.bindings.memory.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      // Set this memory to the new value on change
      this.memory = value;
      // Create memoryElements to iterate over memory in *ngFor once
      if (!this.memoryElements) this.memoryElements = range(0, this.memory.length, 4);
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    // Rerun check on signal changes
    this.simulationComponent.stageSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((stage) => {
      this.checkActiveMemory()
    });
    this.cpu.bindings.instrMemRead.pipe(takeUntil(this.ngUnsubscribe)).subscribe((stage) => {
      this.checkActiveMemory()
    });
    this.cpu.bindings.memread.pipe(takeUntil(this.ngUnsubscribe)).subscribe((stage) => {
      this.checkActiveMemory()
    });
  }

  /**
   * Get 4 bytes form buffer and return decimal integer representation
   * e.g. 0x484850 -> 0d4737104
   * @param data Memory array buffer
   * @param location Start of the four bytes
   */
  read4BytesLittleEndian(data: Buffer, location) {
    return data[location + 3] * 256 * 256 * 256
      + data[location + 2] * 256 * 256
      + data[location + 1] * 256
      + data[location + 0];
  }

  /**
   * Get 4 bytes form buffer and display as hex string with space between.
   * e.g. 0x484850 -> "48 49 50"
   * @param data Memory array buffer
   * @param location Start of the four bytes
   */
  get4BytesHex(data: Buffer, location) {
    let s = byteToHex(data[location + 3], 2) + ' ';
    s += byteToHex(data[location + 2], 2) + ' ';
    s += byteToHex(data[location + 1], 2) + ' ';
    s += byteToHex(data[location], 2);
    return s;
  }

  /**
   * Get 4 bytes from memory and display them as ascii.
   * e.g. 0x484950 -> "012"
   * @param data Memory array buffer
   * @param location Start of the four bytes
   */
  get4BytesAscii(data: Buffer, location) {
    let s = String.fromCharCode(data[location + 3]);
    s += String.fromCharCode(data[location + 2]);
    s += String.fromCharCode(data[location + 1]);
    s += String.fromCharCode(data[location]);
    return s;
  }

  /**
   * Check if the memory is used.
   * If used set address, leftInfo, rightInfo, topInfo
   */
  checkActiveMemory() {
    let address = null;
    if (this.isExecStage()) {
      if (this.isLoad()) {
        address = this.cpu.bindings.rs1Imm.value;
        this.leftInfo = address;
        this.rightInfo = this.cpu.bindings.memread.value;
        const info = INSTRUCTIONS_DESCRIPTIONS[this.cpu.bindings.instruction.value?.instructionName];
        this.topInfo = `${info?.desc} (${info?.name})`;
      } else if(this.isStore()) {
        address = this.cpu.bindings.rs1Imm.value;
        this.rightInfo = address;
        this.leftInfo = this.cpu.bindings.rs2.value;
        const info = INSTRUCTIONS_DESCRIPTIONS[this.cpu.bindings.instruction.value?.instructionName];
        this.topInfo = `${info?.desc} (${info?.name})`;
      }
    }
    if (this.isFetchStage()) {
      address = this.cpu.bindings.pc.value;
      this.leftInfo = address;
      this.rightInfo = this.cpu.bindings.instrMemRead.value;
      this.topInfo = 'Load instruction';
    }
    this.scroll.scrollInto(address, true, -100);
    this.address = address;
  }

  isLoad() {
    return this.cpu.bindings.instruction.value?.opcode == OPCODES.LOAD;
  }

  isStore() {
    return this.cpu.bindings.instruction.value?.opcode == OPCODES.STORE;
  }

  isExecStage() {
    // Use stage of simulation and not of CPU
    // CPU stage could be off when infoText is shown before the next CPU cycle is started
    // Sometimes infoText of next stage need to be shown before CPU does sometging
    // E.g. The user is told inside the execute stage that something is written to memory,
    // in the next step the cpu executes that command
    return this.simulationComponent.stage === CPU_STATES.EXECUTE;
  }

  isFetchStage() {
    return this.simulationComponent.stage === CPU_STATES.FETCH;
  }
}
