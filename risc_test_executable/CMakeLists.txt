#
# Make RISC-V executable which runs on the processor
#

project(riscv-exe)
set(CMAKE_VERBOSE_MAKEFILE ON)

enable_language(C ASM)
set(RISV_PATH /Users/gafert/opt/riscv64-toolchain/bin)
set(RISC_COMPILER ${RISV_PATH}/riscv64-unknown-elf-gcc)
set(RISC_OBJ ${RISV_PATH}/riscv64-unknown-elf-objcopy)
set(RISC_DUMP ${RISV_PATH}/riscv64-unknown-elf-objdump)
set(RISC_STRIP ${RISV_PATH}/riscv64-unknown-elf-strip)
set(RISC_READELF ${RISV_PATH}/riscv64-unknown-elf-readelf)

set(CMAKE_C_COMPILER ${RISC_COMPILER})
set(CMAKE_CXX_COMPILER ${RISC_COMPILER})
set(CMAKE_ASM_COMPILER ${RISC_COMPILER})

set(CMAKE_C_FLAGS "-g -O0 -march=rv32i -mabi=ilp32")
set(CMAKE_ASM_FLAGS "-g -O0 -march=rv32i -mabi=ilp32")

set(CMAKE_C_LINK_FLAGS "-march=rv32i -mabi=ilp32")
set(CMAKE_CXX_LINK_FLAGS "-march=rv32i -mabi=ilp32")

add_executable(program program.c syscalls.c start_stdlib.s)

set_target_properties(
        program
        PROPERTIES
        SUFFIX ".elf"
        LINK_FLAGS "-T riscv_stdlib.ld -lgcc"
)