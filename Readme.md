# RISC-V Simulation

## Folder Structure

### binaries

Includes prebuild binaries. This includes the simulation binary for all platforms.
These `binaries` will be part of the complete electron app inside the resource path and not packaged into the app.asar.

Libraries are loaded via node-ffi-napi.

### simulation_library

Has the source for the simulation library. Build tested on macOS and windows with mingw64.
The resulting shared library will be placed in `binaries`.

If Verilator is installed the verilog sources can also be changed and recompiled. Else the
`simulation_library/verilated_sources` and `simulation_library/verilated_dependencies` will be used.

To make the library run:

`npm run build:simlib`

### simulation_library/bindgen

If the verilog sources are changed to exported variables might also change. To regenerate to binding from the library to the app a python script can be used.
It uses python 3 to generate appropriate .h, .cc, and .ts files.

`python` and `pip` version 3.7 must be in your path.

Additional libraries may be installed.

To use this python script run:

`npm run build:simlib_binding`

### risc_test_executable

A simple example which can be compiled with the risc-v toolchain.
start_stdlib.s and riscv_stdlib.ld together with syscalls can be used to use the whole libc.
This makes the resulting elf much larger and not easy to follow.

It is better to use riscv.ls, start.s and the -nostdlib flag of gcc to have a simpler elf.



