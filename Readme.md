[![Build Status](https://travis-ci.com/gafert/RISC-V-Simulation.svg?branch=master)](https://travis-ci.com/gafert/RISC-V-Simulation)

# RISC-V Simulation

Download the latest [release](https://github.com/gafert/RISC-V-Simulation/releases).

## Folder Structure

### risc_test_executable

A simple example which can be compiled with the risc-v toolchain.
start_stdlib.s and riscv_stdlib.ld together with syscalls can be used to use the whole libc.
This makes the resulting elf much larger and not easy to follow.

It is better to use riscv.ls, start.s and the -nostdlib flag of gcc to have a simpler elf.


