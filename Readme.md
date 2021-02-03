![Build/release](https://github.com/gafert/RISC-V-Simulation/workflows/Build/release/badge.svg)

# Apate - a visual CPU Simulator

Download the latest [release](https://github.com/gafert/RISC-V-Simulation/releases).

This simulator is a tool for students to learn the inner workings of a CPU. Based on the RISC V instruction set (RV32I) it provides a visual step by step guid trough the flow of a CPU. 

## Features

* Step by step guid trough the CPU
* See the current instruction and what that instruciton does
* Information about each element and signal of the CPU
* See all registers, memory
* Run examples
* Compile your own code with integrated editor and compiler
* Complex CPU elements simplified
* Not focused on speed, verification, completeness or correct depiction of HDL but on principles of teaching

## Under the hood

* Runs on [electron](https://www.electronjs.org/)
* Visualisation with [three.js](https://github.com/mrdoob/three.js) and SVGLoader
* Interface with Angular
* Custom JavaScript ELF parser
* Custom JavaScript instruciton decoder
* Custom JavaSript CPU based RV32I ISA


Thank you to [@jameslzhu](https://github.com/jameslzhu) and his [RISC V Reference Sheet](https://github.com/jameslzhu/riscv-card)


