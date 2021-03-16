import { TestBed } from '@angular/core/testing';

import { CPUService } from './cpu.service';
import { execSync } from 'child_process';

/*it('riscv64-unknown-elf-objdump', function() {
  const stdout = execSync('riscv64-unknown-elf-objdump -v').toString();
  expect(stdout.startsWith("GNU objdump ")).toBeTrue();
  console.log("riscv64-unknown-elf-objdump with version " + stdout.split(/([ \n\r])/)[8] + " is installed");
});*/

const elfLocations = [
  { name: 'adder', location: 'main_renderer/static/demos/adder/main.elf' },
  { name: 'function', location: 'main_renderer/static/demos/function/main.elf' },
  { name: 'print', location: 'main_renderer/static/demos/print/main.elf' }
];

function initCPUService(elfPath): CPUService {
  const service: CPUService = TestBed.get(CPUService);
  service.init(elfPath);
  return service;
}

function execReadElf(elfPath): string {
  return execSync(`riscv64-unknown-elf-readelf -a ${elfPath}`).toString();
}

/**
 * Test for elf parsing, instruction decoding and cpu functionality of each instruction.
 *
 * These tools must be installed and in the path for this tests:
 *
 * riscv64-unknown-elf-readelf
 * GNU readelf (GNU Binutils) 2.35
 *
 * riscv64-unknown-elf-objdump
 * GNU objdump (GNU Binutils) 2.35
 */
elfLocations.forEach((elf) => {
  const elfPath = elf.location;

  describe('ELF parsing of ' + elf.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('riscv64-unknown-elf-readelf', function() {
      const stdout = execSync('riscv64-unknown-elf-readelf -v').toString();
      expect(stdout.startsWith('GNU readelf ')).toBeTrue();
      console.log('riscv64-unknown-elf-readelf with version ' + stdout.split(/([ \n\r])/)[8] + ' is installed');
    });


    it('elf initiated', () => {
      const service = initCPUService(elfPath);

      expect(service.elfIsLoaded).toBeTrue();

      console.log('CPU Service initiated ELF file with ' + (service.parsedElf.section_headers.length - 1) + ' section headers');
    });

    it('elf machine riscv', () => {
      const service = initCPUService(elfPath);

      expect(service.parsedElf.e_machine).toEqual(0xF3); // Is RISC-V
      console.log('Loaded ELF file with RISC-V machine type');
    });

    it('elf start of program headers', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      expect(service.elfIsLoaded).toBeTrue();

      const startOfProgramHeader = Number(/(?:Start of program headers:)(?:[ ]+)(\d+)/.exec(readElf)[1]);
      expect(service.parsedElf.e_phoff).toEqual(startOfProgramHeader);

      console.log('Start of program headers equals to ' + startOfProgramHeader);
    });

    it('elf start of section headers', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      const sectionHeaderStart = Number(/(?:Start of section headers:)(?:[ ]+)(\d+)/.exec(readElf)[1]);
      expect(service.parsedElf.e_shoff).toEqual(sectionHeaderStart);

      console.log('Start of section headers equals to ' + sectionHeaderStart);
    });

    it('elf section headers size', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      const sectionHeaderSize = Number(/(?:Size of section headers:)(?:[ ]+)(\d+)/.exec(readElf)[1]);
      expect(service.parsedElf.e_shentsize).toEqual(sectionHeaderSize);

      console.log('Size of section headers equals to ' + sectionHeaderSize);
    });

    it('elf section header number', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      const numSectionHeaders = Number(/(?:Number of section headers:)(?:[ ]+)(\d+)/.exec(readElf)[1]);
      expect(service.parsedElf.e_shnum).toEqual(numSectionHeaders);

      console.log('Number of section headers equals to ' + numSectionHeaders);
    });

    it('elf section header string table index', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      const strTableIndex = Number(/(?:Section header string table index:)(?:[ ]+)(\d+)/.exec(readElf)[1]);
      expect(service.parsedElf.e_shstrndx).toEqual(strTableIndex);

      console.log('Section header string table index equals to ' + strTableIndex);
    });

    it('elf section headers', () => {
      const readElf = execReadElf(elfPath)
      const service = initCPUService(elfPath);

      function getSectionHeaderParts(e, n) {
        const regex = `(?: {2}\\[${n.toString().length == 2 ? '' : ' '}${n.toString()}\\] )(.\\w+.?\\w+) +(\\w+) +(\\d+) ([\\d\\w]+) ([\\d\\w]+)`;
        return new RegExp(regex).exec(e);
      }

      for (let i = 1; i < service.parsedElf.section_headers.length - 1; i++) {
        const parts = getSectionHeaderParts(readElf, i);
        const name = parts[1];
        const type = parts[2];
        const addr = parseInt(parts[3], 16);
        const off = parseInt(parts[4], 16);
        const size = parseInt(parts[5], 16);

        expect(service.parsedElf.section_headers[i].name).toEqual(name);
        expect(service.parsedElf.section_headers[i].sh_offset).toEqual(off);
        expect(service.parsedElf.section_headers[i].sh_size).toEqual(size);
      }

      console.log(`${service.parsedElf.section_headers.length - 1} section headers have been parsed and equal in name, offset and size`);
    });
  });
});
