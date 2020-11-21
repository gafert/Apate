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



