import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Bindings, CPU_STATES } from './bindingSubjects';
import { readFileSync } from 'fs';
import {
  BRANCH_FUNC,
  getNameFromInstruction,
  IMM_FUNC,
  LOAD_FUNC,
  OP_FUNC3,
  OPCODES,
  parseInstruction,
  STORE_FUNC
} from './instructionParser';
import { parseElf, parseElfRISCVInstructions } from './elfParser';


@Injectable({
  providedIn: 'root'
})
export class SimLibInterfaceService implements OnDestroy {
  public bindings = new Bindings();
  public elfIsLoaded = false;
  public parsedElf;

  constructor() {
  }

  initSimulation(pathToElf: string) {
    console.log(pathToElf);
    // Open ELF File
    const elfBuffer = readFileSync(pathToElf);
    this.parsedElf = parseElf(elfBuffer);
    parseElfRISCVInstructions(this.parsedElf, elfBuffer);

    console.log(this.parsedElf);
    // Read program
    this.parsedElf.program.copy(this.bindings.memory.value, 0, 0);
    // this.bindings.memory.next();

    this.bindings.pc.next(0);
    this.bindings.nextCpuState.next(CPU_STATES.READ_DATA_FROM_MEMORY);
    this.elfIsLoaded = true;
  }

  advanceSimulationClock() {
    switch (this.bindings.nextCpuState.value) {
      case CPU_STATES.BREAK:
        this.bindings.cpuState.next(CPU_STATES.BREAK);
        break;
      case CPU_STATES.READ_DATA_FROM_MEMORY:
        this.bindings.memAddress.next(this.bindings.pc.value);
        this.bindings.memReadData.next(this.fetchDataFromMemory(this.bindings.memAddress.value));
        this.bindings.cpuState.next(CPU_STATES.READ_DATA_FROM_MEMORY);
        this.bindings.nextCpuState.next(CPU_STATES.DECODE_INSTRUCTION);
        break;
      case CPU_STATES.DECODE_INSTRUCTION:
        const inst = parseInstruction(this.bindings.memReadData.value);
        console.log(inst);
        this.bindings.instruction.next(inst);

        this.bindings.rs1addr.next(inst.rs1);
        this.bindings.rs1addr.next(inst.rs2);
        this.bindings.rs1.next(this.bindings.cpuregs.value[inst.rs1]);
        this.bindings.rs2.next(this.bindings.cpuregs.value[inst.rs2]);
        this.bindings.rd.next(inst.rd);
        this.bindings.imm.next(inst.imm);

        this.bindings.cpuState.next(CPU_STATES.DECODE_INSTRUCTION);
        this.bindings.nextCpuState.next(CPU_STATES.EXECUTE);
        break;
      case CPU_STATES.EXECUTE:
        this.bindings.nextCpuState.next(CPU_STATES.READ_DATA_FROM_MEMORY);
        const instruction = this.bindings.instruction.value;
        const registers = this.bindings.cpuregs.value;
        const immediate = this.bindings.instruction.value.imm;
        let pc = this.bindings.pc.value;
        const rs1Value = this.bindings.rs1.getValue();
        const rs2Value = this.bindings.rs2.getValue();
        switch (instruction.opcode) {
          case OPCODES.OP:
            switch (instruction.func3) {
              case OP_FUNC3.ADD || OP_FUNC3.SUB:
                if (instruction.func7 == 0x20) {
                  // Sub
                  registers[instruction.rd] = rs1Value - rs2Value;
                } else {
                  // Add
                  registers[instruction.rd] = rs1Value + rs2Value;
                }
                break;
              case OP_FUNC3.XOR:
                registers[instruction.rd] = rs1Value ^ rs2Value;
                break;
              case OP_FUNC3.OR:
                registers[instruction.rd] = rs1Value | rs2Value;
                break;
              case OP_FUNC3.AND:
                registers[instruction.rd] = rs1Value & rs2Value;
                break;
              case OP_FUNC3.SLL:
                registers[instruction.rd] = rs1Value << rs2Value;
                break;
              case OP_FUNC3.SRL || OP_FUNC3.SRA:
                if (instruction.func7 == 0x20) {
                  // msb extends
                  registers[instruction.rd] = rs1Value >> rs2Value;
                } else {
                  registers[instruction.rd] = rs1Value >>> rs2Value;
                }
                break;
              case OP_FUNC3.SLT:
                registers[instruction.rd] = rs1Value < rs2Value ? 1 : 0;
                break;
              case OP_FUNC3.SLTU:
                registers[instruction.rd] = rs1Value < rs2Value ? 1 : 0;
                break;
            }
            pc = pc + 4;
            break;
          case OPCODES.IMM:
            switch (instruction.func3) {
              case IMM_FUNC.ADDI:
                registers[instruction.rd] = rs1Value + immediate;
                break;
              case IMM_FUNC.XORI:
                registers[instruction.rd] = rs1Value ^ immediate;
                break;
              case IMM_FUNC.ORI:
                registers[instruction.rd] = rs1Value | immediate;
                break;
              case IMM_FUNC.ANDI:
                registers[instruction.rd] = rs1Value & immediate;
                break;
              case IMM_FUNC.SLLI:
                registers[instruction.rd] = rs1Value << (immediate & 0b1111);
                break;
              case IMM_FUNC.SRLI || IMM_FUNC.SRAI:
                if (instruction.func7 == 0x20) {
                  // msb extends
                  registers[instruction.rd] = rs1Value >>> (immediate & 0b1111);
                } else {
                  registers[instruction.rd] = rs1Value >> (immediate & 0b1111);
                }
                break;
              case IMM_FUNC.SLTI:
                registers[instruction.rd] = rs1Value < immediate ? 1 : 0;
                break;
              case IMM_FUNC.SLTIU:
                registers[instruction.rd] = rs1Value < immediate ? 1 : 0;
                break;
            }
            pc = pc + 4;
            break;
          case OPCODES.LOAD:
            const loadedMemory = this.bindings.memory.value;
            const memoryAddressToLoad = rs1Value + immediate;
            const memoryValue = this.fetchDataFromMemory(memoryAddressToLoad);
            if (instruction.rd !== 0)
              switch (instruction.func3) {
                case LOAD_FUNC.LB:
                  // sign-extend
                  registers[instruction.rd] = (memoryValue & 0b11111111);
                  break;
                case LOAD_FUNC.LBU:
                  // zero-extend
                  registers[instruction.rd] = (memoryValue & 0b11111111);
                  break;
                case LOAD_FUNC.LH:
                  // sign-extend
                  registers[instruction.rd] = (memoryValue & 0b1111111111111111);
                  break;
                case LOAD_FUNC.LHU:
                  // zero-extend
                  registers[instruction.rd] = (memoryValue & 0b1111111111111111);
                  break;
                case LOAD_FUNC.LW:
                  registers[instruction.rd] = memoryValue & 0b11111111111111111111111111111111;
                  break;
              }
            pc = pc + 4;
            break;
          case OPCODES.STORE:
            const memory = this.bindings.memory.value;
            const memoryAddress = rs1Value + immediate;
            // Special write function
            if (memoryAddress == 23456) {
              this.bindings.callBufferWriteCallbacks(rs2Value);
              pc = pc + 4;
              break;
            }
            switch (instruction.func3) {
              case STORE_FUNC.SB:
                memory[memoryAddress] = rs2Value & 0xFF;
                break;
              case STORE_FUNC.SH:
                memory[memoryAddress] = rs2Value & 0xFF;
                memory[memoryAddress + 1] = (rs2Value >> 0xFF) & 0xFF;
                break;
              case STORE_FUNC.SW:
                memory[memoryAddress] = rs2Value & 0xFF;
                memory[memoryAddress + 1] = (rs2Value >> 0xFF) & 0xFF;
                memory[memoryAddress + 2] = (rs2Value >> 0xFFFF) & 0xFF;
                memory[memoryAddress + 3] = (rs2Value >> 0xFFFFFF) & 0xFF;
                break;
            }
            this.bindings.memory.next(memory);
            pc = pc + 4;
            break;
          case OPCODES.BRANCH:
            switch (instruction.func3) {
              case BRANCH_FUNC.BEQ:
                if (rs1Value == rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
              case BRANCH_FUNC.BNE:
                if (rs1Value != rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
              case BRANCH_FUNC.BLT:
                if (rs1Value < rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
              case BRANCH_FUNC.BGE:
                if (rs1Value >= rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
              case BRANCH_FUNC.BLTU:
                if (rs1Value < rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
              case BRANCH_FUNC.BGEU:
                if (rs1Value <= rs2Value) {
                  pc += immediate;
                } else {
                  pc = pc + 4;
                }
                break;
            }
            break;
          case OPCODES.JAL:
            if (instruction.rd !== 0)
              registers[instruction.rd] = pc + 4;
            pc += immediate;
            break;
          case OPCODES.JALR:
            if (instruction.rd !== 0)
              registers[instruction.rd] = pc + 4;
            pc = rs1Value + immediate;
            break;
          case OPCODES.LUI:
            if (instruction.rd !== 0)
              registers[instruction.rd] = immediate << 12;
            pc = pc + 4;
            break;
          case OPCODES.AUIPC:
            if (instruction.rd !== 0)
              registers[instruction.rd] = pc + (immediate << 12);
            pc = pc + 4;
            break;
          case OPCODES.SYSTEM:
            this.bindings.nextCpuState.next(CPU_STATES.BREAK);
            break;
        }

        this.bindings.pc.next(pc);
        this.bindings.cpuregs.next(registers);
        // Set instruction, rd, rs, imm
        this.bindings.cpuState.next(CPU_STATES.EXECUTE);
        this.bindings.nextCpuState.next(CPU_STATES.READ_DATA_FROM_MEMORY);
        break;
      case CPU_STATES.WRITE_BACK:

        break;
      case CPU_STATES.ADVANCE_PC:

        break;
    }
  }

  advanceSimulationPc() {

  }

  read4BytesLittleEndian(data, location) {
    return data[location + 3] * 256 * 256 * 256
      + data[location + 2] * 256 * 256
      + data[location + 1] * 256
      + data[location + 0];
  }

  dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  fetchDataFromMemory(location) {
    return this.read4BytesLittleEndian(this.bindings.memory.value, location);
  }

  ngOnDestroy(): void {

  }
}
