---
title: "CPU Simulation - Stages"
author: Michael Gafert
date: November 21, 2020
geometry: margin=2cm
---

# Stages

This simulation is based on the Integer RISC-V instruction set (RV32I). 
The CPU architecture consists of 5 stages. 
The stage is changed each step and repeated as long as the program does not reach a break or ecall. 
For simplicity it is not pipelined. Each instruction must finish all stages before the next instruction is read. 
The stage cycle is always the same: Fetch ➜ Decode ➜ Execute ➜ Write Back ➜ Advance PC ➜ Repeat 

Each stage is executed after it was highlighted. E.g.: Decoding stage is highlighted means that the next step executes the decoding.

## Fetch

In the fetch stage the next 4 memory bytes (32 bits) are read from the internal memory. The address of the byte is set by the program counter. The resulting data is the next instruction and will be passed on to the decoder to be decoded.

## Decode

In the decode stage the new 32 bit instruction is parsed. How the instruction bytes are parsed can be seen in the [Decoder](decoder.md). Results of the parsed instruction include the following values:

* Return register (RD)
* Register Source 1 (RS1)
* Register Source 2 (RS1)
* Immediate Value (Imm)
* Function 3 (FUNC3)
* Function 7 (FUNC7)
* And one of the following instruction types:
    * OP (R)
    * IMM (I)
    * LOAD (I)
    * STORE (S)
    * JAL (B)
    * JALR (J)
    * LUI (U)
    * AUIPC (U)
    * BREAK (I)

The instruction types are a group of same behaving instructions. The meaning of these values can be seen in [Instruction](instruction.md).

Not all above values are used depending on the instruction type. If the register is not used, it is displayed as 'NaN' or '/'.

After the instruction bytes are parsed RS1 and RS2, which are register addresses, are read from the registers. How the registers are addressed can be viewed at [Register](register.md).

After the instruction is parsed the paths which are used depending on the instructions are highlighted. A legend can be found at [CPU Legend](cpu_legend.md).

## Execute

The execution stage can be separated in three groups depending on the current instruction: 

* ALU Instructions (OP, IMM, LUI, AUIPC, JAL, JALR)
* Memory Instructions (LOAD, STORE)
* Branch Instructions (BRANCH)

Each group is only hightlighted if the current instruction uses them.

### ALU Instructions

ALU instructions are all instructions which need the [ALU](alu.md) to do the following: add, substract, shift left, shift right, compare and shift, and, or, xor.
The arithmetic and logic functions are performed on the OP1 and OP2 values. Depending on the instruction different values are passed to the [ALU](alu.md). The selection is done via the Instruction Type and a network of [Multiplexer (MUXs)](multiplexer.md). Depending on the control signal (blue, see [CPU Legend](cpu_legend.md) for more) the MUXs pass different values to the ALU. 
Some instructions need additional logic after the ALU. The AUIPC instruction requires the output of the ALU to be added to the PC before it is passed to the next stage.

As the ALU instructions are only combinational, the values are valid even tough the stage was not executed yet.

### Memory Instructions

Memory instructions include type LOAD (lb, lh, lw, lbu, lhu) and STORE (sb, sh, sw). 
Both LOAD and STORE instructions required that RS1 value and IMM value are added together to build the memory address. 
The value is passed in RS2. On STORE instructions the [Memory](memory.md) can be observed once the stage is executed. A marker in the [Memory](memory.md) displays changed values.

On LOAD instructions the loaded value is passed to the Write Back stage.

### Branch Instructions

Instructions of type BRANCH include (beq, bne, blt, bltu, bge, bgeu). These instructions can be combined to: equal, not equal, lower than, greater equals than. In all cases RS1 and RS2 are compared. The result of the comparison is either true or false. Depending on the FUNC3 value which was encoded into the instruction the correct result is selected by a MUX and possibly inverted depending on the following table. 

As 'lower than' and 'greater or equal than' are a negation of one another, both instructions can use the same 'lower than' comparison and, if 'greated equal than' is wanted, be negated.
The same method works with 'equal' and 'not equal'. If the result is negated depends on the 0 bit of FUNC3. To negate a XOR is used.

This now results in two comparisons: 'equal' and 'less than'. If bit 1-2 of FUNC3 are zero 'equal' comparison is used. Other values select the 'less than' comparison.

| Instruction| FUNC3         | FUNC3 bit 0   | FUNC3  bit 1-2  | Selected comparison | Result is negated |
|------------|---------------|---------------|-----------------|---------------------|-------------------|
| BEQ        | 000           | 0             | 0               | equal               | no 
| BNE        | 001           | 1             | 0               | equal               | yes
| BLT        | 100           | 0             | 2               | less than           | no
| BLTU       | 110           | 0             | 3               | less than           | no
| BGE        | 101           | 1             | 1               | less than           | yes
| BGEU       | 111           | 1             | 3               | less than           | yes

The 1 bit wide result signals are highlighted if they represent a 1 value and have been activated by the MUX.
To select specific bits a splitter (green) is used. The numbers next to the green slitter display which bits of the FUNC3 bus are selected and passed along.

The result of the BRANCH instruction will be used when setting the program counter in the Advance Program Counter stage. 

## Write Back

After the execution stage some values need to be written back to the registers. The value to be written can come from a LOAD, IMM or OP instruction. The write back register address is set by the RD signal which was encoded into the instruction.
The value is only written once the stage has been executed.

## Advance Program Counter (PC) 

The last stage is to advance the program counter. Depending on the instruction the PC can be set to:

| Instruction Type                 | PC            |
|----------------------------------|---------------|
| OP, IMM, LUI, AUIPC, LOAD, STORE | PC = PC + 4
| BRANCH evaluated false           | PC = PC + 4
| BRANCH evaluated true            | PC = PC + IMM
| JAL                              | PC = PC + IMM
| JALR                             | PC = RS1 + IMM

The PC is changed when the stage has been executed. Once the PC is changed you will immediately see that the signal of the PC also changed and ready for the next instruction.


# Register                                                   
                                                             
The RV32I instruction set has 32 registers each containing 32 bits.                 
                                                             
| Register   | ABI Name  | Description            |        | 
|------------|-----------|------------------------|--------| 
| x0         | zero      | Zero constant          |        | 
| x1         | ra        | Return address         | Caller | 
| x2         | sp        | Stack pointer          |        | 
| x3         | gp        | Global pointer         |        | 
| x4         | tp        | Thread pointer         | Callee | 
| x5-x7      | t0-t2     | Temporaries            | Caller | 
| x8         | s0 / fp   | Saved / frame pointer  | Callee | 
| x9         | s1        | Saved register         | Callee | 
| x10-x11    | a0-a1     | Fn args/return values  | Caller | 
| x12-x17    | a2-a7     | Fn args                | Caller | 
| x18-x27    | s2-s11    | Saved registers        | Callee | 
| x28-x31    | t3-t6     | Temporaries            | Caller | 

# Instruction

The raw instruction code is 32 bits long and consists depending on the type of: Opcode, IMM, RD, RS1, RS2, FUNC3, FUNC7.

**Opcode**: Constant bits to get instruction type

**IMM (Immediate value)**: Value saved directly in the instruction. E.g. when using: a = b + 5. The value 5 is saved in the instruction.

**RD (Return register)**: The register index the computed value will be written to in the write back stage.

**RS1 (Register source 1)**: From which register a value should be used. E.g. ADD RS1=15 RS2=16 RD=16. Value in register x15 will be added to value in register x16 and saved in register x16.

**RS2 (Register source 2)**: From which register a value should be used.

**FUNC3 and FUNC7**: Differentiates between instructions. See table beneath.

Depending on the opcode the instruction format can be inferred. The instruction format is used as a map at which locations values such as RD, IMM are stored.
FUNC3 and FUNC7 are used to differentiate between instructions with the same opcode. FUNC3 and FUNC7 are used by for example the [ALU](alu.md) to distinguish the arithmetical or logical operation. 

To control the MUXs in the CPU signals with the type (OP, IMM, LOAD, STORE, BRANCH, JAL, JALR, LUI, AUIPC, BREAK) are set corresponding to each instruction. The type can also be inferred from the opcode.
                                                                                                                                                             
| Type   | Uses ALU  | Inst   |  Name                     | FMT | Opcode     | FUNC3  | FUNC7          | Description                  | Note                                                           
|--------|-----------|--------|---------------------------|-----|------------|--------|----------------|------------------------------|-----------------                                               
| OP     | yes       | add    | ADD                       | R   | 0110011    | 0x0    | 0x00           | rd = rs1 + rs2               |                                                                
| OP     | yes       | sub    | SUB                       | R   | 0110011    | 0x0    | 0x20           | rd = rs1 - rs2               |                                                                
| OP     | yes       | xor    | XOR                       | R   | 0110011    | 0x4    | 0x00           | rd = rs1 ^ rs2               |                                                                
| OP     | yes       | or     | OR                        | R   | 0110011    | 0x6    | 0x00           | rd = rs1 &#124; rs2          |                                                                
| OP     | yes       | and    | AND                       | R   | 0110011    | 0x7    | 0x00           | rd = rs1 & rs2               |                                                                
| OP     | yes       | sll    | Shift Left Logical        | R   | 0110011    | 0x1    | 0x00           | rd = rs1 << rs2              |                                                                
| OP     | yes       | srl    | Shift Right Logical       | R   | 0110011    | 0x5    | 0x00           | rd = rs1 >> rs2              |                                                                
| OP     | yes       | sra    | Shift Right Arith*        | R   | 0110011    | 0x5    | 0x20           | rd = rs1 >> rs2              | msb-extends                                                    
| OP     | yes       | slt    | Set Less Than             | R   | 0110011    | 0x2    | 0x00           | rd = (rs1 < rs2)?1:0         |                                                                
| OP     | yes       | sltu   | Set Less Than (U)         | R   | 0110011    | 0x3    | 0x00           | rd = (rs1 < rs2)?1:0         | zero-extends                                                   
| IMM    | yes       | addi   | ADD Immediate             | I   | 0010011    | 0x0    |                | rd = rs1 + imm               |                                                                
| IMM    | yes       | xori   | XOR Immediate             | I   | 0010011    | 0x4    |                | rd = rs1 ^ imm               |                                                                
| IMM    | yes       | ori    | OR Immediate              | I   | 0010011    | 0x6    |                | rd = rs1 &#124; imm          |                                                                
| IMM    | yes       | andi   | AND Immediate             | I   | 0010011    | 0x7    |                | rd = rs1 & imm               |                                                                
| IMM    | yes       | slli   | Shift Left Logical Imm    | I   | 0010011    | 0x1    | imm[5:11]=0x00 | rd = rs1 << imm[0:4]         |                                                                
| IMM    | yes       | srli   | Shift Right Logical Imm   | I   | 0010011    | 0x5    | imm[5:11]=0x00 | rd = rs1 >> imm[0:4]         |                                                                
| IMM    | yes       | srai   | Shift Right Arith Imm     | I   | 0010011    | 0x5    | imm[5:11]=0x20 | rd = rs1 >> imm[0:4]         | msb-extends                                                    
| IMM    | yes       | slti   | Set Less Than Imm         | I   | 0010011    | 0x2    |                | rd = (rs1 < imm)?1:0         |                                                                
| IMM    | yes       | sltiu  | Set Less Than Imm (U)     | I   | 0010011    | 0x3    |                | rd = (rs1 < imm)?1:0         | zero-extends                                                   
| LOAD   |           | lb     | Load Byte                 | I   | 0000011    | 0x0    |                | rd = M[rs1+imm][0:7]         |                                                                
| LOAD   |           | lh     | Load Half                 | I   | 0000011    | 0x1    |                | rd = M[rs1+imm][0:15]        |                                                                
| LOAD   |           | lw     | Load Word                 | I   | 0000011    | 0x2    |                | rd = M[rs1+imm][0:31]        |                                                                
| LOAD   |           | lbu    | Load Byte (U)             | I   | 0000011    | 0x4    |                | rd = M[rs1+imm][0:7]         | zero-extends                                                   
| LOAD   |           | lhu    | Load Half (U)             | I   | 0000011    | 0x5    |                | rd = M[rs1+imm][0:15]        | zero-extends                                                   
| STORE  |           | sb     | Store Byte                | S   | 0100011    | 0x0    |                | M[rs1+imm][0:7]  = rs2[0:7]  |                                                                
| STORE  |           | sh     | Store Half                | S   | 0100011    | 0x1    |                | M[rs1+imm][0:15] = rs2[0:15] |                                                                
| STORE  |           | sw     | Store Word                | S   | 0100011    | 0x2    |                | M[rs1+imm][0:31] = rs2[0:31] |                                                                
| BRANCH |           | beq    | Branch ==                 | B   | 1100011    | 0x0    |                | if(rs1 == rs2) PC += imm     |                                                                
| BRANCH |           | bne    | Branch !=                 | B   | 1100011    | 0x1    |                | if(rs1 != rs2) PC += imm     |                                                                
| BRANCH |           | blt    | Branch <                  | B   | 1100011    | 0x4    |                | if(rs1 < rs2) PC += imm      |                                                                
| BRANCH |           | bge    | Branch $\leq$             | B   | 1100011    | 0x5    |                | if(rs1 >= rs2) PC += imm     |                                                                
| BRANCH |           | bltu   | Branch < (U)              | B   | 1100011    | 0x6    |                | if(rs1 < rs2) PC += imm      | zero-extends                                                   
| BRANCH |           | bgeu   | Branch $\geq$ (U)         | B   | 1100011    | 0x7    |                | if(rs1 >= rs2) PC += imm     | zero-extends                                                   
| JAL    | yes       | jal    | Jump And Link             | J   | 1101111    |        |                | rd = PC+4; PC += imm         |                                                                
| JALR   | yes       | jalr   | Jump And Link Reg         | I   | 1100111    | 0x0    |                | rd = PC+4; PC = rs1 + imm    |                                                                
| LUI    | yes       | lui    | Load Upper Imm            | U   | 0110111    |        |                | rd = imm << 12               |                                                                
| AUIPC  | yes       | auipc  | Add Upper Imm to PC       | U   | 0010111    |        |                | rd = PC + (imm << 12)        |                                                                
| BREAK  |           | ecall  | Environment Call          | I   | 1110011    | 0x0    | imm=0x0        | Transfer control to OS       |                                                                
| BREAK  |           | ebreak | Environment Break         | I   | 1110011    | 0x0    | imm=0x1        | Transfer control to debugger |                                                                
                                                                                                                                                                                           
# Memory

The internal memory is XX bytes big and contains program memory and ram.

## Special memory locations

Special memory locations enable special functions like printing to a terminal or accessing different interfaces.

### Print

Data written to the memory location _0x2345_ is printed to the terminal and not stored inside the internal memory.
The value will be printed as an ASCII character.

### Display

Size of memory ...

How to read memory

How to write memory
