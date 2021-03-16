import { TestBed } from '@angular/core/testing';
import { parseInstruction } from './instructionParser';

describe('Instruction Parser', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('addi', function() {
    const instr = parseInstruction(0xfe010113);
    expect(instr.assembly).toEqual('addi sp,sp,-32')
  });

  it('sw', function() {
    const instr = parseInstruction(0x00812e23);
    expect(instr.assembly).toEqual('sw s0,28(sp)')
  });

  it('jalr', function() {
    const instr = parseInstruction(0x00008067);
    console.log(instr)
    expect(instr.assembly).toEqual('jalr zero,0(ra)')
  });

  it('jal', function() {
    // Provide address of this instruction to allow relative to absolute address conversion
    const instr = parseInstruction(0x0200006f, 0x20);
    expect(instr.assembly).toEqual('jal zero,40')
  });

  it('lw', function() {
    const instr = parseInstruction(0xfec42783);
    expect(instr.assembly).toEqual('lw a5,-20(s0)')
  });

  it('bne', function() {
    // Provide address of this instruction to allow relative to absolute address conversion
    const instr = parseInstruction(0xfc079ee3, 0x48);
    expect(instr.assembly).toEqual('bne a5,zero,24')
  });

  it('ecall', function() {
    const instr = parseInstruction(0x00000073);
    expect(instr.assembly).toEqual('ecall')
  });

  it('lui', function() {
    const instr = parseInstruction(0x00000137);
    expect(instr.assembly).toEqual('lui sp,0x0')
  });
})
