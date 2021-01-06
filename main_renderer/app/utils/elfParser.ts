import {Instruction, parseInstruction} from './instructionParser';

export enum SHF_CONSTANTS {
  SHF_WRITE = 0x1,
  SHF_ALLOC = 0x2,
  SHF_EXECINSTR = 0x4,
  SHF_STRINGS = 0x20
}

export enum STT_CONSTANTS {
  STT_NOTYPE = 0,
  STT_OBJECT = 1,
  STT_FUNC = 2,
  STT_SECTION = 3,
  STT_FILE = 4
}

export function ELF32_ST_BIND(info) {
  return (info) >> 4;
}

export function ELF32_ST_TYPE(info) {
  return (info) & 0xf;
}

export function ELF32_ST_INFO(bind, type) {
  return ((bind) << 4) + (type & 0xf);
}

export interface ElfSymbol {
  st_name: string;
  st_value: number;
  st_size: number;
  st_info: number;
  st_shndx: number;
  sh_name: string;
  instructions?: Instruction[];
  name: string;
}

export interface SectionHeader {
  name: string;
  sh_name: number;
  sh_type: number;
  sh_offset: number;
  sh_size: number;
  sh_entsize: number;
  sh_flags: number;
  strings?: any[];
  instructions?: Instruction[];
  symbols?: ElfSymbol[];
  data?: Buffer;
}

export interface ELF {
  /** Section Header start */
  e_shoff: number;
  /** Section Header number */
  e_shnum: number;
  /** Section Header size */
  e_shentsize: number;
  /** Section Header text table */
  e_shstrndx: number;
  /** Program Header start */
  e_phoff: number;
  /** Program offset */
  p_offset: number;
  /** Program memory size */
  p_memsz: number;
  /** Program memory */
  program: Buffer;
  /** Section Headers */
  section_headers: SectionHeader[];
  /** Symbols */
  symbols: ElfSymbol[];
}

function read4BytesLittleEndian(data, location) {
  return data[location + 3] * 256 * 256 * 256
    + data[location + 2] * 256 * 256
    + data[location + 1] * 256
    + data[location + 0];
}

function read2BytesLittleEndian(data, location) {
  return data[location + 1] * 256
    + data[location + 0];
}

function read1ByteLittleEndian(data, location) {
  return data[location];
}

function readString(data, location) {
  let string = '';
  let c = 0;
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (1) {
    c = data[location + i];
    if (c == 0 || c == undefined || i > 30) {
      break;
    }
    string += String.fromCharCode(c);
    i++;
  }
  return string;
}

/**
 * Parses an elf
 * @param elf
 */
export function parseElf(elf: Buffer): ELF {
  const parsedElf: ELF = {
    e_shentsize: 0, e_shnum: 0, section_headers: [],
    e_shoff: 0,
    e_shstrndx: 0,
    symbols: [],
    e_phoff: 0, p_memsz: 0, p_offset: 0, program: undefined
  };

  // Read Section Header
  parsedElf.e_shoff = read4BytesLittleEndian(elf, 0x20);
  parsedElf.e_shentsize = read2BytesLittleEndian(elf, 0x2E);
  parsedElf.e_shnum = read2BytesLittleEndian(elf, 0x30);
  parsedElf.e_shstrndx = read2BytesLittleEndian(elf, 0x32);


  for (let i = 0; i < parsedElf.e_shnum; i++) {
    // @ts-ignore
    const sectionHeader: SectionHeader = {};
    sectionHeader.sh_name = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i);
    sectionHeader.sh_type = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i + 0x04);
    sectionHeader.sh_offset = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i + 0x10);
    sectionHeader.sh_size = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i + 0x14);
    sectionHeader.sh_entsize = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i + 0x24);
    sectionHeader.sh_flags = read4BytesLittleEndian(elf, parsedElf.e_shoff + parsedElf.e_shentsize * i + 0x8);
    parsedElf.section_headers.push(sectionHeader);
  }

  // Get names of sections
  const sectionHeaderNames = parsedElf.section_headers[parsedElf.e_shstrndx];
  for (const section_header of parsedElf.section_headers) {
    section_header.name = readString(elf, sectionHeaderNames.sh_offset + section_header.sh_name);
  }

  // Get strings of .strtab
  const stringSectionHeader: number = parsedElf.section_headers.findIndex((value) => value.name == '.strtab');
  const stringBuffer = elf.slice(parsedElf.section_headers[stringSectionHeader].sh_offset,
    parsedElf.section_headers[stringSectionHeader].sh_offset +
    parsedElf.section_headers[stringSectionHeader].sh_size);
  parsedElf.section_headers[stringSectionHeader].strings = stringBuffer.toString().split('\0');

  const symbolSectionHeaders = parsedElf.section_headers.filter((s) => s.sh_type == 2);
  for (const symbolSectionHeader of symbolSectionHeaders) {
    const num = symbolSectionHeader.sh_size / symbolSectionHeader.sh_entsize;

    for (let i = 0; i < num; i++) {
      // @ts-ignore
      const elfSymbol: ElfSymbol = {};
      elfSymbol.st_value = read4BytesLittleEndian(elf, symbolSectionHeader.sh_offset + i * symbolSectionHeader.sh_entsize + 0x4);
      elfSymbol.st_info = read1ByteLittleEndian(elf, symbolSectionHeader.sh_offset + i * symbolSectionHeader.sh_entsize + 0xC);
      elfSymbol.st_size = read4BytesLittleEndian(elf, symbolSectionHeader.sh_offset + i * symbolSectionHeader.sh_entsize + 0x8);
      elfSymbol.st_shndx = read2BytesLittleEndian(elf, symbolSectionHeader.sh_offset + i * symbolSectionHeader.sh_entsize + 0xe);
      elfSymbol.st_name = read4BytesLittleEndian(elf, symbolSectionHeader.sh_offset + i * symbolSectionHeader.sh_entsize + 0x00);
      elfSymbol.sh_name = parsedElf.section_headers[elfSymbol.st_shndx] ? parsedElf.section_headers[elfSymbol.st_shndx].name : null;
      if (elfSymbol.st_name) {
        elfSymbol.name = readString(elf, parsedElf.section_headers[stringSectionHeader].sh_offset + elfSymbol.st_name);
      } else {
        elfSymbol.name = elfSymbol.sh_name;
      }

      if (elfSymbol.sh_name) {
        if (!parsedElf.section_headers[elfSymbol.st_shndx].symbols)
          parsedElf.section_headers[elfSymbol.st_shndx].symbols = [];

        if (ELF32_ST_TYPE(elfSymbol.st_info) == STT_CONSTANTS.STT_NOTYPE
          || ELF32_ST_TYPE(elfSymbol.st_info) == STT_CONSTANTS.STT_FUNC)
          parsedElf.section_headers[elfSymbol.st_shndx].symbols.push(elfSymbol);
      }
      parsedElf.symbols.push(elfSymbol);
    }
  }

  // Read Program Header
  parsedElf.e_phoff = read4BytesLittleEndian(elf, 0x1c);
  parsedElf.p_offset = read4BytesLittleEndian(elf, parsedElf.e_phoff + 0x04);
  parsedElf.p_memsz = read4BytesLittleEndian(elf, parsedElf.e_phoff + 0x14);
  parsedElf.program = elf.slice(parsedElf.p_offset, parsedElf.p_offset + parsedElf.p_memsz);

  parsedElf.symbols.sort((symbol1, symbol2) => {
    return symbol1.st_value > symbol2.st_value ? 1 : -1;
  });

  return parsedElf;
}

/**
 * Parse instructions of rv32i ISA
 * @param parsedElf
 * @param elf
 */
export function parseElfRISCVInstructions(parsedElf: ELF, elf: Buffer) {
  parsedElf.section_headers.forEach((sectionHeader) => {
    if (sectionHeader.symbols)
      sectionHeader.symbols.forEach((symbol, i) => {
        symbol.instructions = [];
        if (ELF32_ST_TYPE(symbol.st_info) == STT_CONSTANTS.STT_NOTYPE
          || ELF32_ST_TYPE(symbol.st_info) == STT_CONSTANTS.STT_FUNC) {
          let lastOffset: number;
          if (symbol.st_size) {
            // Read until the size is over -> STT_FUNC
            lastOffset = parsedElf.p_offset + symbol.st_value + symbol.st_size;
          } else {
            if (sectionHeader.symbols.length > i + 1) {
              // Read until start of next symbol in section
              lastOffset = sectionHeader.sh_offset + sectionHeader.symbols[i + 1].st_value;
            } else {
              // Read until end of section
              lastOffset = sectionHeader.sh_offset + sectionHeader.sh_size;
            }
          }
          for (let i = parsedElf.p_offset + symbol.st_value; i < lastOffset; i = i + 4) {
            const instruction = parseInstruction(read4BytesLittleEndian(elf, i));
            // Add where the parsed instruction is
            instruction.pc = i - parsedElf.p_offset;
            symbol.instructions.push(instruction);
          }
        }
      });
  });
}

