export enum IMM_FUNC {
  ADDI = 0,
  SLLI = 1,
  SLTI = 2,
  SLTIU = 3,
  XORI = 4,
  SRLI = 5,
  SRAI = 5,
  ORI = 6,
  ANDI = 7
}

export enum OP_FUNC3 {
  ADD = 0,
  SUB = 0,
  SLL = 1,
  SLT = 2,
  SLTU = 3,
  XOR = 4,
  SRL = 5,
  SRA = 5,
  OR = 6,
  AND = 7
}

export enum BRANCH_FUNC {
  BEQ = 0,
  BNE = 1,
  BLT = 4,
  BGE = 5,
  BLTU = 6,
  BGEU = 7
}

export enum LOAD_FUNC {
  LB = 0,
  LH = 1,
  LW = 2,
  LD = 3,
  LBU = 4,
  LHU = 5,
  LWU = 6
}

export enum STORE_FUNC {
  SB = 0,
  SH = 1,
  SW = 2,
}

export enum SYSTEM_FUNC3 {
  ECALL = 0,
  EBREAK = 0
}

/**
 * OPCODES 6:0 (1:0 are always 0x11) so they are ignored here
 */
export enum OPCODES {
  IMM = 0x04,
  LUI = 0x0D, // Direct
  AUIPC = 0x05, // Direct
  OP = 0x0C,
  JAL = 0x1B, // Direct
  JALR = 0x19, // Direct
  BRANCH = 0x18,
  LOAD = 0x00,
  STORE = 0x08,
  SYSTEM = 0x1C
}

export const OPCODE_FUNC3 = {
  [OPCODES.IMM]: IMM_FUNC,
  [OPCODES.OP]: OP_FUNC3,
  [OPCODES.BRANCH]: BRANCH_FUNC,
  [OPCODES.LOAD]: LOAD_FUNC,
  [OPCODES.STORE]: STORE_FUNC,
  [OPCODES.SYSTEM]: SYSTEM_FUNC3
};

export enum INSTRUCTION_FORMATS {
  R = 'R', //       funct7 rs2 rs1 funct3          rd opcode
  I = 'I', //    imm[11:0]     rs1 funct3          rd opcode
  S = 'S', //    imm[11:5] rs2 rs1 funct3    imm[4:0] opcode
  B = 'B', // imm[12|10:5] rs2 rs1 funct3 imm[4:1|11] opcode
  U = 'U', //   imm[31:12]                         rd opcode
  J = 'J'  // imm[20|10:1|11|19:12]                rd opcode
}

export const OPCODE_INSTRUCTION_FORMAT = {
  [OPCODES.IMM]: INSTRUCTION_FORMATS.I,
  [OPCODES.OP]: INSTRUCTION_FORMATS.R,
  [OPCODES.BRANCH]: INSTRUCTION_FORMATS.B,
  [OPCODES.LOAD]: INSTRUCTION_FORMATS.I,
  [OPCODES.STORE]: INSTRUCTION_FORMATS.S,
  [OPCODES.SYSTEM]: INSTRUCTION_FORMATS.I,
  [OPCODES.JAL]: INSTRUCTION_FORMATS.J,
  [OPCODES.JALR]: INSTRUCTION_FORMATS.I,
  [OPCODES.AUIPC]: INSTRUCTION_FORMATS.U,
  [OPCODES.LUI]: INSTRUCTION_FORMATS.U
};

export interface Instruction {
  imm: number;
  immI: number;
  immS: number;
  immB: number;
  immU: number;
  immJ: number;

  rd: number;
  opcode: OPCODES;
  func3: OP_FUNC3 | BRANCH_FUNC | STORE_FUNC | LOAD_FUNC | IMM_FUNC;
  func7: any;
  rs1: number;
  rs2: number;
  type: INSTRUCTION_FORMATS;
  instruction: number;
  name: string;
  pc?: number; // Not added by parser but maybe later while reading elf
}

export const INSTRUCTION_NAME_MAP = {};

export function convertToSigned(bitnumber, bitlenght): number {
  const mask = 2 ** (bitlenght - 1);
  return -(bitnumber & mask) + (bitnumber & ~mask);
}

export const INSTRUCTIONS = {
  ADDI: 'ADDI',
  SLLI: 'SLLI',
  SLTI: 'SLTI',
  SLTIU: 'SLTIU',
  XORI: 'XORI',
  SRLI: 'SRLI',
  SRAI: 'SRAI',
  ORI: 'ORI',
  ANDI: 'ANDI',
  ADD: 'ADD',
  SUB: 'SUB',
  SLL: 'SLL',
  SLT: 'SLT',
  SLTU: 'SLTU',
  XOR: 'XOR',
  SRL: 'SRL',
  SRA: 'SRA',
  OR: 'OR',
  AND: 'AND',
  BEQ: 'BEQ',
  BNE: 'BNE',
  BLT: 'BLT',
  BGE: 'BGE',
  BLTU: 'BLTU',
  BGEU: 'BGEU',
  LB: 'LB',
  LH: 'LH',
  LW: 'LW',
  LBU: 'LBU',
  LHU: 'LHU',
  SB: 'SB',
  SH: 'SH',
  SW: 'SW',
  ECALL: 'ECALL',
  EBREAK: 'EBREAK',
  JAL: 'JAL',
  JALR: 'JALR',
  AUIPC: 'AUIPC',
  LUI: 'LUI'
};

export const INSTRUCTIONS_DESCRIPTIONS = {
  [INSTRUCTIONS.ADDI]: {
    name: 'addi',
    desc: 'Add immediate',
    formula: 'rd = rs1 + imm',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SLLI]: {
    name: 'slli',
    desc: 'Shift Left Logical Imm',
    formula: 'rd = rs1 << imm[0:4]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SLTI]: {
    name: 'slti',
    desc: 'Set Less Than Imm',
    formula: 'rd = (rs1 < imm)?1:0',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SLTIU]: {
    name: 'sltiu',
    desc: 'Set Less Than Imm (U)',
    formula: 'rd = (rs1 < imm)?1:0',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.XORI]: {
    name: 'xori',
    desc: 'Exclusive OR Immediate',
    formula: 'rd = rs1 ˆ imm',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SRLI]: {
    name: 'srli',
    desc: 'Shift Right Logical Imm',
    formula: 'rd = rs1 >> imm[0:4]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SRAI]: {
    name: 'srai',
    desc: 'Shift Right Arith. Imm',
    formula: 'rd = rs1 >> imm[0:4]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.ORI]:  {
    name: 'ori',
    desc: 'OR Immediate',
    formula: 'rd = rs1 | imm',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.ANDI]:  {
    name: 'andi',
    desc: 'AND Immediate',
    formula: 'rd = rs1 & imm',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.ADD]: {
    name: 'add',
    desc: 'ADD',
    formula: 'rd = rs1 + rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SUB]: {
    name: 'sub',
    desc: 'SUB',
    formula: 'rd = rs1 - rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SLL]: {
    name: 'sll',
    desc: 'Shift Left Locical',
    formula: 'rd = rs1 << rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SLT]: {
    name: 'slt',
    desc: 'Set Less Than',
    formula: 'rd = (rs1 < rs2)?1:0',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SLTU]: {
    name: 'sltu',
    desc: 'Set Less Than (U)',
    formula: 'rd = (rs1 < rs2)?1:0',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.XOR]: {
    name: 'xor',
    desc: 'XOR',
    formula: 'rd = rs1 ˆ rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SRL]: {
    name: 'srl',
    desc: 'Shift Right Logical',
    formula: 'rd = rs1 >> rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.SRA]: {
    name: 'sra',
    desc: 'Shift Right Arith.',
    formula: 'rd = rs1 >> rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.OR]: {
    name: 'or',
    desc: 'OR',
    formula: 'rd = rs1 | rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.AND]: {
    name: 'and',
    desc: 'AND',
    formula: 'rd = rs1 & rs2',
    rs1: true,
    rs2: true,
    imm: false,
    rd: true,
  },
  [INSTRUCTIONS.BEQ]: {
    name: 'beq',
    desc: 'Branch Equal',
    formula: 'if(rs1 == rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.BNE]: {
    name: 'bne',
    desc: 'Branch Not Equal',
    formula: 'if(rs1 != rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.BLT]: {
    name: 'blt',
    desc: 'Branch Lower Than',
    formula: 'if(rs1 < rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.BGE]: {
    name: 'bge',
    desc: 'Branch Greater Equal',
    formula: 'if(rs1 >= rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.BLTU]: {
    name: 'bltu',
    desc: 'Branch Lower Than (U)',
    formula: 'if(rs1 < rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.BGEU]: {
    name: 'bgeu',
    desc: 'Branch Greater Equal (U)',
    formula: 'if(rs1 >= rs2) PC += imm',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.LB]: {
    name: 'lb',
    desc: 'Load Byte',
    formula: 'rd = M[rs1+imm][0:7]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.LH]: {
    name: 'lh',
    desc: 'Load Half',
    formula: 'rd = M[rs1+imm][0:15]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.LW]: {
    name: 'lw',
    desc: 'Load Word',
    formula: 'rd = M[rs1+imm][0:31]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.LBU]: {
    name: 'ld',
    desc: 'Load Word',
    formula: 'rd = M[rs1+imm][0:31]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.LHU]: {
    name: 'lhu',
    desc: 'Load Half (U)',
    formula: 'rd = M[rs1+imm][0:15]',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.SB]: {
    name: 'sb',
    desc: 'Store Byte',
    formula: 'M[rs1+imm][0:7] = rs2[0:7]',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.SH]: {
    name: 'sh',
    desc: 'Store Half',
    formula: 'M[rs1+imm][0:15] = rs2[0:15]',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.SW]: {
    name: 'sw',
    desc: 'Store Word',
    formula: 'M[rs1+imm][0:31] = rs2[0:31]',
    rs1: true,
    rs2: true,
    imm: true,
    rd: false,
  },
  [INSTRUCTIONS.ECALL]: {
    name: 'ecall',
    desc: 'Environment Call',
    formula: 'Transfer control',
    rs1: false,
    rs2: false,
    imm: false,
    rd: false,
  },
  [INSTRUCTIONS.EBREAK]: {
    name: 'ebreak',
    desc: 'Environment Break',
    formula: 'Transfer control',
    rs1: false,
    rs2: false,
    imm: false,
    rd: false,
  },
  [INSTRUCTIONS.JAL]: {
    name: 'jal',
    desc: 'Jump And Link',
    formula: 'rd = PC + 4; PC += imm',
    rs1: false,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.JALR]: {
    name: 'jalr',
    desc: 'Jump And Link Ref',
    formula: 'rd = PC + 4; PC = rs1 + imm',
    rs1: true,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.AUIPC]: {
    name: 'auipc',
    desc: 'Add Upper Imm to PC',
    formula: 'rd = PC + (imm << 12)',
    rs1: false,
    rs2: false,
    imm: true,
    rd: true,
  },
  [INSTRUCTIONS.LUI]: {
    name: 'lui',
    desc: 'Load Upper Imm',
    formula: 'rd = imm << 12',
    rs1: false,
    rs2: false,
    imm: true,
    rd: true,
  },
};


const NAME_LOOKUP_TABLE = {
  [OPCODES.IMM]: {
    [IMM_FUNC.ADDI]: INSTRUCTIONS.ADDI,
    [IMM_FUNC.SLLI]: INSTRUCTIONS.SLLI,
    [IMM_FUNC.SLTI]: INSTRUCTIONS.SLTI,
    [IMM_FUNC.SLTIU]: INSTRUCTIONS.SLTIU,
    [IMM_FUNC.XORI]: INSTRUCTIONS.XORI,
    [IMM_FUNC.SRLI]: {
      0x00: INSTRUCTIONS.SRAI,
      0x20: INSTRUCTIONS.SRLI
    },
    [IMM_FUNC.ORI]: INSTRUCTIONS.ORI,
    [IMM_FUNC.ANDI]: INSTRUCTIONS.ANDI
  },
  [OPCODES.OP]: {
    [OP_FUNC3.ADD]: {
      0x00: INSTRUCTIONS.ADD,
      0x20: INSTRUCTIONS.SUB
    },
    [OP_FUNC3.SLL]: INSTRUCTIONS.SLL,
    [OP_FUNC3.SLT]: INSTRUCTIONS.SLT,
    [OP_FUNC3.SLTU]: INSTRUCTIONS.SLTU,
    [OP_FUNC3.XOR]: INSTRUCTIONS.XOR,
    [OP_FUNC3.SRL]: {
      0x00: INSTRUCTIONS.SRL,
      0x20: INSTRUCTIONS.SRA
    },
    [OP_FUNC3.OR]: INSTRUCTIONS.OR,
    [OP_FUNC3.AND]: INSTRUCTIONS.AND
  },
  [OPCODES.BRANCH]: {
    [BRANCH_FUNC.BEQ]: INSTRUCTIONS.BEQ,
    [BRANCH_FUNC.BNE]: INSTRUCTIONS.BNE,
    [BRANCH_FUNC.BLT]: INSTRUCTIONS.BLT,
    [BRANCH_FUNC.BGE]: INSTRUCTIONS.BGE,
    [BRANCH_FUNC.BLTU]: INSTRUCTIONS.BLTU,
    [BRANCH_FUNC.BGEU]: INSTRUCTIONS.BGEU
  },
  [OPCODES.LOAD]: {
    [LOAD_FUNC.LB]: INSTRUCTIONS.LB,
    [LOAD_FUNC.LH]: INSTRUCTIONS.LH,
    [LOAD_FUNC.LW]: INSTRUCTIONS.LW,
    [LOAD_FUNC.LBU]: INSTRUCTIONS.LBU,
    [LOAD_FUNC.LHU]: INSTRUCTIONS.LHU,
  },
  [OPCODES.STORE]: {
    [STORE_FUNC.SB]: INSTRUCTIONS.SB,
    [STORE_FUNC.SH]: INSTRUCTIONS.SH,
    [STORE_FUNC.SW]: INSTRUCTIONS.SW
  },
  [OPCODES.SYSTEM]: {
    [SYSTEM_FUNC3.ECALL]: {
      0x00: INSTRUCTIONS.ECALL,
      0x01: INSTRUCTIONS.EBREAK
    }
  },
  [OPCODES.JAL]: INSTRUCTIONS.JAL,
  [OPCODES.JALR]: INSTRUCTIONS.JALR,
  [OPCODES.AUIPC]: INSTRUCTIONS.AUIPC,
  [OPCODES.LUI]: INSTRUCTIONS.LUI
};

export function getNameFromInstruction(instruction: Instruction): string {
  try {
    let op = null;
    if (instruction.opcode == OPCODES.SYSTEM) {
      return NAME_LOOKUP_TABLE[instruction.opcode][instruction.func3][instruction.imm];
    } else {
      op = NAME_LOOKUP_TABLE[instruction.opcode];
      if (typeof op !== 'string') op = op[instruction.func3];
      if (typeof op !== 'string') op = op[instruction.func7];
      return op;
    }
  } catch (e) {
    console.log("Could not find instruction name for", instruction, e);
  }
  return 'unimplemented';
}

/**
 * Parses a instruction e.g. 0x058000ef. BigEndian encoding.
 * @param instruction The instruction encoded in big endian as a number
 */
export function parseInstruction(instruction): Instruction {
  const always11 = (instruction) & 0b11; // The first two bits are always 11
  const opcode = (instruction >> 2) & 0b11111;
  const type = OPCODE_INSTRUCTION_FORMAT[opcode];

  let rd = null;
  if (type === INSTRUCTION_FORMATS.R
    || type === INSTRUCTION_FORMATS.I
    || type === INSTRUCTION_FORMATS.U
    || type === INSTRUCTION_FORMATS.J) {
    rd = (instruction >> 7) & 0b11111;
  }

  let func3: OP_FUNC3 | BRANCH_FUNC | STORE_FUNC | LOAD_FUNC | IMM_FUNC = null;
  let rs1 = null;
  if (type === INSTRUCTION_FORMATS.R
    || type === INSTRUCTION_FORMATS.I
    || type === INSTRUCTION_FORMATS.S
    || type === INSTRUCTION_FORMATS.B) {
    func3 = (instruction >> 12) & 0b111;
    rs1 = (instruction >> 15) & 0b11111;
  }

  let func7: number = null;
  if (type === INSTRUCTION_FORMATS.R) {
    func7 = (instruction >> 25) & 0b1111111;
  }

  let rs2: number = null;
  if (type === INSTRUCTION_FORMATS.R
    || type === INSTRUCTION_FORMATS.S
    || type === INSTRUCTION_FORMATS.B) {
    rs2 = (instruction >> 20) & 0b11111;
  }

  // All possible immediate values
  let immI: number = null;
  immI = (instruction >> 20) & 0b111111111111;
  immI = convertToSigned(immI, 12);

  let immS: number = null;
  immS = ((instruction >> 7) & 0b11111) + (((instruction >> 25) & 0b1111111) << 5);
  immS = convertToSigned(immS, 12);

  let immB: number = null;
  immB = (((instruction >> 31) & 0b1) << 12)
    + (((instruction >> 25) & 0b111111) << 5)
    + (((instruction >> 7) & 0b1) << 11)
    + (((instruction >> 8) & 0b1111) << 1);
  immB = convertToSigned(immB, 13);

  let immU: number = null;
  immU = (instruction >> 12) & 0b11111111111111111111;
  immU = convertToSigned(immU, 32);

  let immJ: number = null;
  immJ = (((instruction >> 31) & 0b1) << 20)
    + (((instruction >> 21) & 0b1111111111) << 1)
    + (((instruction >> 20) & 0b1) << 11)
    + (((instruction >> 12) & 0b11111111) << 12);
  immJ = convertToSigned(immJ, 21);

  // The immediate value selected corresponding to the instruction
  let imm: number = null;
  switch (type) {
    case INSTRUCTION_FORMATS.I:
      imm = immI;
      break;
    case INSTRUCTION_FORMATS.S:
      imm = immS;
      break;
    case INSTRUCTION_FORMATS.B:
      imm = immB;
      break;
    case INSTRUCTION_FORMATS.U:
      imm = immU;
      break;
    case INSTRUCTION_FORMATS.J:
      imm = immJ;
      break;
    default:
      imm = null;
  }

  const parsedInstruction: Instruction = {
    opcode: opcode,
    type: type,
    func3: func3,
    func7: func7,
    imm: imm,
    immI: immI,
    immS: immS,
    immB: immB,
    immU: immU,
    immJ: immJ,
    rd: rd,
    rs1: rs1,
    rs2: rs2,
    instruction: instruction,
    name: null
  };

  parsedInstruction.name = getNameFromInstruction(parsedInstruction);

  return parsedInstruction;
}

export function isIMM(name: string): boolean {
  return name === INSTRUCTIONS.ADDI ||
    name === INSTRUCTIONS.XORI ||
    name === INSTRUCTIONS.ORI ||
    name === INSTRUCTIONS.ANDI ||
    name === INSTRUCTIONS.SLLI ||
    name === INSTRUCTIONS.SRLI ||
    name === INSTRUCTIONS.SRAI ||
    name === INSTRUCTIONS.SLTI ||
    name === INSTRUCTIONS.SLTIU;
}

export function isOP(name: string): boolean {
  return name === INSTRUCTIONS.ADD ||
    name === INSTRUCTIONS.SUB ||
    name === INSTRUCTIONS.XOR ||
    name === INSTRUCTIONS.OR ||
    name === INSTRUCTIONS.AND ||
    name === INSTRUCTIONS.SLL ||
    name === INSTRUCTIONS.SRL ||
    name === INSTRUCTIONS.SRA ||
    name === INSTRUCTIONS.SLT ||
    name === INSTRUCTIONS.SLTU;
}

export function isLOAD(name: string): boolean {
  return name === INSTRUCTIONS.LB ||
    name === INSTRUCTIONS.LH ||
    name === INSTRUCTIONS.LW ||
    name === INSTRUCTIONS.LBU ||
    name === INSTRUCTIONS.LHU;
}

export function isSTORE(name: string): boolean {
  return name === INSTRUCTIONS.SB ||
    name === INSTRUCTIONS.SH ||
    name === INSTRUCTIONS.SW;
}

export function isBRANCH(name: string): boolean {
  return name === INSTRUCTIONS.BEQ ||
    name === INSTRUCTIONS.BNE ||
    name === INSTRUCTIONS.BLT ||
    name === INSTRUCTIONS.BGE ||
    name === INSTRUCTIONS.BLTU ||
    name === INSTRUCTIONS.BGEU;
}

export function isJAL(name: string): boolean {
  return name === INSTRUCTIONS.JAL
}

export function isJALR(name: string): boolean {
  return name === INSTRUCTIONS.JALR
}

export function isLUI(name: string): boolean {
  return name === INSTRUCTIONS.LUI
}

export function isAUIPC(name: string): boolean {
  return name === INSTRUCTIONS.AUIPC
}

export function isBREAK(name: string): boolean {
  return name === INSTRUCTIONS.ECALL || name === INSTRUCTIONS.EBREAK;
}

