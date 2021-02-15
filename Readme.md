![Build/release](https://github.com/gafert/Apate/workflows/Build/release/badge.svg)

# Apate - a visual CPU Simulator

Download the latest build for Windows, macOS or Linux in the [releases](https://github.com/gafert/Apate/releases) 

This simulator is a tool for students to learn the inner workings of a CPU. Based on the RISC V instruction set (RV32I) it provides a visual step by step guide through the flow of a CPU. 

![Screenshot](https://github.com/gafert/Apate/blob/master/res/apate.png?raw=true)

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


Thank you to [@jameslzhu](https://github.com/jameslzhu) for [RISC V Reference Sheet](https://github.com/jameslzhu/riscv-card), and [@anvaka](https://github.com/anvaka) for [three.map.control](https://github.com/anvaka/three.map.control). Other used packages are in the packages.json.





