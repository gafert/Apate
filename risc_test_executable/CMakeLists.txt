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

set(CMAKE_C_FLAGS "-O0 -march=rv32i -mabi=ilp32")
set(CMAKE_ASM_FLAGS "-O0 -march=rv32i -mabi=ilp32")

set(CMAKE_C_LINK_FLAGS "")
set(CMAKE_CXX_LINK_FLAGS "")

add_executable(program program.c start.s)
add_dependencies(program make_program_ld)

set_target_properties(
        program
        PROPERTIES
        SUFFIX ".elf"
        LINK_FLAGS "-T program.ld -lgcc -nostdlib"
)

add_custom_target(make_program_ld
        # Application entry point is only used when stdlib riscv linker file is used
        COMMAND less ${CMAKE_CURRENT_SOURCE_DIR}/riscv.ld > program.ld)

add_custom_target(make_program_hex
        DEPENDS program
        COMMAND ${RISC_OBJ} -O verilog ${CMAKE_CURRENT_BINARY_DIR}/program.elf program.hex
        WORKING_DIRECTORY ${CMAKE_BINARY_DIR})

add_custom_target(read_elf
        DEPENDS strip_debug
        COMMAND ${RISC_READELF} -a ${CMAKE_CURRENT_BINARY_DIR}/program.elf > ${CMAKE_CURRENT_SOURCE_DIR}/program_readelf.txt
        WORKING_DIRECTORY ${CMAKE_BINARY_DIR})

add_custom_target(make_program_dump
        DEPENDS program
        COMMAND ${RISC_DUMP} --section .text.init --section .text --section .data --full-contents --disassemble --syms --wide --source -z ${CMAKE_CURRENT_BINARY_DIR}/program.elf >  ${CMAKE_CURRENT_SOURCE_DIR}/program_objdump.txt
        WORKING_DIRECTORY ${CMAKE_BINARY_DIR})

