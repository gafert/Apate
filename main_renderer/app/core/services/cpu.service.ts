import {Injectable} from '@angular/core';
import {Bindings, CPU_STATES} from './bindingSubjects';
import {readFileSync} from 'fs';
import {
  Instruction,
  INSTRUCTIONS,
  isAUIPC,
  isBRANCH,
  isIMM,
  isJAL,
  isJALR,
  isLOAD,
  isLUI,
  isOP,
  isSTORE,
  isSystem,
  parseInstruction
} from './instructionParser';
import {parseElf, parseElfRISCVInstructions} from './elfParser';


@Injectable({
  providedIn: 'root'
})
export class CPUService {
  public bindings = new Bindings();
  public elfIsLoaded = false;
  public parsedElf;

  constructor() {
  }

  public initSimulation(pathToElf: string) {
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
    this.bindings.cpuState.next(null);
    this.bindings.nextCpuState.next(CPU_STATES.FETCH);
    this.elfIsLoaded = true;
  }

  public advanceSimulationClock() {
    switch (this.bindings.nextCpuState.value) {
      case CPU_STATES.BREAK:
        this.bindings.cpuState.next(CPU_STATES.BREAK);
        break;
      case CPU_STATES.FETCH:
        this.bindings.instrMemRead.next(this.fetchDataFromMemory(this.bindings.pc.value));
        this.bindings.cpuState.next(CPU_STATES.FETCH);
        this.bindings.nextCpuState.next(CPU_STATES.DECODE_INSTRUCTION);
        break;
      case CPU_STATES.DECODE_INSTRUCTION:
        this.bindings.instruction.next(parseInstruction(this.bindings.instrMemRead.value));

        this.bindings.rs1addr.next(this.bindings.instruction.value.rs1);
        this.bindings.rs2addr.next(this.bindings.instruction.value.rs2);
        this.bindings.rs1.next(this.bindings.instruction.value.rs1 !== null ? this.bindings.cpuregs.value[this.bindings.instruction.value.rs1] : null);
        this.bindings.rs2.next(this.bindings.instruction.value.rs2 !== null ? this.bindings.cpuregs.value[this.bindings.instruction.value.rs2] : null);
        this.bindings.rd.next(this.bindings.instruction.value.rd);
        this.bindings.imm.next(this.bindings.instruction.value.imm);
        this.bindings.func3.next(this.bindings.instruction.value.func3);
        this.bindings.func7.next(this.bindings.instruction.value.func7);

        this.bindings.branchFunc3_0.next(this.bindings.func3.value !== null ? this.bindings.func3.value & 0b001 : null);
        this.bindings.branchFunc3_12.next(this.bindings.func3.value !== null ? this.bindings.func3.value & 0b110 : null);

        this.bindings.cpuState.next(CPU_STATES.DECODE_INSTRUCTION);

        if (isSystem(this.bindings.instruction.value.instructionName)) {
          this.bindings.nextCpuState.next(CPU_STATES.BREAK);
        } else {
          this.bindings.nextCpuState.next(CPU_STATES.EXECUTE);
        }
        break;
      case CPU_STATES.EXECUTE:
        //
        // LOAD STORE
        //

        if (isLOAD(this.bindings.instruction.value.instructionName)) {
          this.bindings.memread.next(this.callMEMORYread(this.bindings.instruction.value, this.bindings.rs1Imm.value));
        } else if (isSTORE(this.bindings.instruction.value.instructionName)) {
          this.callMEMORYwrite(this.bindings.instruction.value, this.bindings.rs1Imm.value, this.bindings.rs2.value);
        }

        this.bindings.cpuState.next(CPU_STATES.EXECUTE);
        this.bindings.nextCpuState.next(CPU_STATES.WRITE_BACK);
        break;
      case CPU_STATES.WRITE_BACK:
        if (isIMM(this.bindings.instruction.value.instructionName) ||
          isOP(this.bindings.instruction.value.instructionName) ||
          isJAL(this.bindings.instruction.value.instructionName) ||
          isJALR(this.bindings.instruction.value.instructionName) ||
          isLUI(this.bindings.instruction.value.instructionName) ||
          isAUIPC(this.bindings.instruction.value.instructionName) ||
          isLOAD(this.bindings.instruction.value.instructionName)) {
          if (this.bindings.rd.value) {
            const cpuregs = this.bindings.cpuregs.value;
            cpuregs[this.bindings.rd.value] = this.bindings.regwrite.value;
            this.bindings.cpuregs.next(cpuregs);
          }
        }

        this.bindings.cpuState.next(CPU_STATES.WRITE_BACK);
        this.bindings.nextCpuState.next(CPU_STATES.ADVANCE_PC);
        break;
      case CPU_STATES.ADVANCE_PC:
        this.bindings.pc.next(this.bindings.pcAdv.value);
        this.bindings.cpuState.next(CPU_STATES.ADVANCE_PC);
        this.bindings.nextCpuState.next(CPU_STATES.FETCH);
        break;
    }

    // COMBINATORIAL LOGIC

    //
    // ALU
    //

    try {
      if (isIMM(this.bindings.instruction.value?.instructionName)) {
        this.bindings.immRs2.next(this.bindings.imm.value);
      } else if (isOP(this.bindings.instruction.value?.instructionName)) {
        this.bindings.immRs2.next(this.bindings.rs2.value);
      }

      if (isOP(this.bindings.instruction.value?.instructionName) || isIMM(this.bindings.instruction.value?.instructionName)) {
        this.bindings.op1.next(this.bindings.immRs2.value);
        this.bindings.op2.next(this.bindings.rs1.value);
      } else if (isJALR(this.bindings.instruction.value?.instructionName) || isJAL(this.bindings.instruction.value?.instructionName)) {
        this.bindings.op1.next(this.bindings.pc.value);
        this.bindings.op2.next(4);
      } else if (isLUI(this.bindings.instruction.value?.instructionName) || isAUIPC(this.bindings.instruction.value?.instructionName)) {
        this.bindings.op1.next(this.bindings.imm.value);
        this.bindings.op2.next(12);
      }

      this.bindings.aluout.next(this.callALU(this.bindings.op1.value, this.bindings.op2.value, this.bindings.instruction.value));
      this.bindings.pcAluout.next(this.bindings.aluout.value + this.bindings.pc.value);
      this.bindings.muxAluout.next(isAUIPC(this.bindings.instruction.value?.instructionName) ? this.bindings.pcAluout.value : this.bindings.aluout.value);


      //
      // LOAD STORE
      //

      this.bindings.rs1Imm.next(this.bindings.rs1.value + this.bindings.imm.value);

      if (isLOAD(this.bindings.instruction.value?.instructionName)) {
        this.bindings.regwrite.next(this.bindings.memread.value);
      } else if (isIMM(this.bindings.instruction.value?.instructionName) ||
        isOP(this.bindings.instruction.value?.instructionName) ||
        isJAL(this.bindings.instruction.value?.instructionName) ||
        isJALR(this.bindings.instruction.value?.instructionName) ||
        isLUI(this.bindings.instruction.value?.instructionName) ||
        isAUIPC(this.bindings.instruction.value?.instructionName)) {
        this.bindings.regwrite.next(this.bindings.muxAluout.value);
      }

      //
      // BRANCH
      //

      this.bindings.branchRs1Rs2BEQ.next(this.bindings.rs1.value == this.bindings.rs2.value ? 1 : 0);
      this.bindings.branchRs1Rs2BLT.next(this.bindings.rs1.value < this.bindings.rs2.value ? 1 : 0);

      if (this.bindings.branchFunc3_12.value === 0) {
        // BEQ, BNE
        this.bindings.branchMuxResult.next(this.bindings.branchRs1Rs2BEQ.value);
      } else if (this.bindings.branchFunc3_12.value >= 1) {
        // BLT, BLTU, BGE, BGEU
        this.bindings.branchMuxResult.next(this.bindings.branchRs1Rs2BEQ.value);
      }

      // Invert if 0 bit is 1 -> this bit means its a BGE or BGEU function
      if (this.bindings.branchFunc3_0.value === 0) {
        this.bindings.branchResult.next(this.bindings.branchMuxResult.value);
      } else {
        this.bindings.branchResult.next(Number(!this.bindings.branchMuxResult.value));
      }

      //
      // PC
      //

      if (this.bindings.branchResult.value === 1) {
        this.bindings.branchAddResult.next(this.bindings.imm.value);
      } else if (this.bindings.branchResult.value === 0) {
        this.bindings.branchAddResult.next(4);
      }

      if (isJAL(this.bindings.instruction.value?.instructionName)) {
        this.bindings.pcAdd.next(this.bindings.imm.value);
      } else if (isBRANCH(this.bindings.instruction.value?.instructionName)) {
        this.bindings.pcAdd.next(this.bindings.branchAddResult.value);
      } else if (this.bindings.instruction.value?.instructionName) {
        this.bindings.pcAdd.next(4);
      }


      this.bindings.pcAdvOther.next(this.bindings.pc.value + this.bindings.pcAdd.value);
      this.bindings.pcAdvJALR.next(this.bindings.rs1.value + this.bindings.imm.value);

      if (isJALR(this.bindings.instruction.value?.instructionName)) {
        this.bindings.pcAdv.next(this.bindings.pcAdvJALR.value);
      } else if (this.bindings.instruction.value?.instructionName) {
        this.bindings.pcAdv.next(this.bindings.pcAdvOther.value);
      }
    } catch (e) {
      console.log('Some value was not initiated yet', e);
    }

    this.bindings.cycleComplete.next(1);

    return this.bindings.cpuState.value;
  }

  public runUntilBreak() {
    let timeout = 10000;

    const advance = () => {
      if (timeout > 0 && this.bindings.cpuState.value != CPU_STATES.BREAK) {
        setTimeout(() => {
          this.advanceSimulationClock();
          timeout--;
          advance();
        }, 1);
      }
    };

    advance();
  }

  public runUntilPC(pc: number): Promise<unknown> {
    let timeout = 10000;

    return new Promise(resolve => {
      const advance = () => {
        if (timeout > 0 && this.bindings.cpuState.value != CPU_STATES.BREAK && pc !== this.bindings.pc.value) {
          setTimeout(() => {
            this.advanceSimulationClock();
            timeout--;
            advance();
          }, 1);
        } else {
          resolve();
        }
      };
      advance();
    });
  }

  private callALU(op1, op2, instruction: Instruction): number {
    switch (instruction?.instructionName) {
      case INSTRUCTIONS.JAL:
      case INSTRUCTIONS.JALR:
      case INSTRUCTIONS.ADDI:
      case INSTRUCTIONS.ADD:
        console.log('ALU ADD');
        return op1 + op2;
      case INSTRUCTIONS.SUB:
        console.log('ALU SUB');
        return op1 - op2;
      case INSTRUCTIONS.XOR:
      case INSTRUCTIONS.XORI:
        console.log('ALU XOR');
        return op1 ^ op2;
      case INSTRUCTIONS.OR:
      case INSTRUCTIONS.ORI:
        console.log('ALU OR');
        return op1 | op2;
      case INSTRUCTIONS.AND:
      case INSTRUCTIONS.ANDI:
        console.log('ALU AND');
        return op1 & op2;
      case INSTRUCTIONS.SLL:
      case INSTRUCTIONS.SLLI:
      case INSTRUCTIONS.LUI:
      case INSTRUCTIONS.AUIPC:
        console.log('ALU <<');
        return op1 << op2;
      case INSTRUCTIONS.SRL:
      case INSTRUCTIONS.SRA:
      case INSTRUCTIONS.SRLI:
      case INSTRUCTIONS.SRAI:
        console.log('ALU >>');
        return op1 >> op2;
      case INSTRUCTIONS.SLT:
      case INSTRUCTIONS.SLTI:
      case INSTRUCTIONS.SLTU:
      case INSTRUCTIONS.SLTIU:
        console.log('ALU SLT');
        return op1 < op2 ? 1 : 0;
      default:
        return 0;
    }
  }

  private callMEMORYread(instruction: Instruction, address): number {
    const memoryValue = this.fetchDataFromMemory(address);
    switch (instruction.instructionName) {
      case INSTRUCTIONS.LB:
        // sign-extend
        console.log('MEMORY LB at ' + address);
        return (memoryValue & 0b11111111);
      case INSTRUCTIONS.LBU:
        // zero-extend
        console.log('MEMORY LBU at ' + address);
        return (memoryValue & 0b11111111);
      case INSTRUCTIONS.LH:
        // sign-extend
        console.log('MEMORY LH at ' + address);
        return (memoryValue & 0b1111111111111111);
      case INSTRUCTIONS.LHU:
        // zero-extend
        console.log('MEMORY LHU at ' + address);
        return (memoryValue & 0b1111111111111111);
      case INSTRUCTIONS.LW:
        console.log('MEMORY LW at ' + address);
        return memoryValue & 0b11111111111111111111111111111111;
      default:
        return 0;
    }
  }

  private callMEMORYwrite(instruction: Instruction, address, value) {
    const memory = this.bindings.memory.value;
    if (address == 23456) {
      this.bindings.callBufferWriteCallbacks(value);
      return;
    }
    switch (instruction.instructionName) {
      case INSTRUCTIONS.SB:
        console.log('MEMORY SB ' + value + ' at ' + address);
        memory[address] = value & 0xFF;
        break;
      case INSTRUCTIONS.SH:
        console.log('MEMORY SH ' + value + ' at ' + address);
        memory[address] = value & 0xFF;
        memory[address + 1] = (value >> 8) & 0xFF;
        break;
      case INSTRUCTIONS.SW:
        console.log('MEMORY SW ' + value + ' at ' + address);
        memory[address] = value & 0xFF;
        memory[address + 1] = (value >> 8) & 0xFF;
        memory[address + 2] = (value >> 16) & 0xFF;
        memory[address + 3] = (value >> 24) & 0xFF;
        break;
    }
    this.bindings.memory.next(memory);
  }

  private read4BytesLittleEndian(data, location) {
    return data[location + 3] * 256 * 256 * 256
      + data[location + 2] * 256 * 256
      + data[location + 1] * 256
      + data[location + 0];
  }

  private fetchDataFromMemory(location) {
    return this.read4BytesLittleEndian(this.bindings.memory.value, location);
  }
}
