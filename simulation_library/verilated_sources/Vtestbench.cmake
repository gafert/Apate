# Verilated -*- CMake -*-
# DESCRIPTION: Verilator output: CMake include script with class lists
#
# This CMake script lists generated Verilated files, for including in higher level CMake scripts.
# This file is meant to be consumed by the verilate() function,
# which becomes available after executing `find_package(verilator).

### Constants...
set(PERL "perl" CACHE FILEPATH "Perl executable (from $PERL)")
set(VERILATOR_ROOT "/usr/local/Cellar/verilator/4.030/share/verilator" CACHE PATH "Path to Verilator kit (from $VERILATOR_ROOT)")

### Compiler flags...
# User CFLAGS (from -CFLAGS on Verilator command line)
set(Vtestbench_USER_CFLAGS )
# User LDLIBS (from -LDFLAGS on Verilator command line)
set(Vtestbench_USER_LDLIBS )

### Switches...
# SystemC output mode?  0/1 (from --sc)
set(Vtestbench_SC 0)
# Coverage output mode?  0/1 (from --coverage)
set(Vtestbench_COVERAGE 0)
# Threaded output mode?  0/1/N threads (from --threads)
set(Vtestbench_THREADS 0)
# VCD Tracing output mode?  0/1 (from --trace)
set(Vtestbench_TRACE_VCD 0)
# FST Tracing output mode? 0/1 (from --fst-trace)
set(Vtestbench_TRACE_FST 0)

### Sources...
# Global classes, need linked once per executable
set(Vtestbench_GLOBAL "${VERILATOR_ROOT}/include/verilated.cpp" "${VERILATOR_ROOT}/include/verilated_dpi.cpp")
# Generated module classes, non-fast-path, compile with low/medium optimization
set(Vtestbench_CLASSES_SLOW )
# Generated module classes, fast-path, compile with highest optimization
set(Vtestbench_CLASSES_FAST "/Users/gafert/Documents/RISC-V-Simulation/simulation_library/verilated_sources/Vtestbench.cpp" "/Users/gafert/Documents/RISC-V-Simulation/simulation_library/verilated_sources/Vtestbench___024unit.cpp")
# Generated support classes, non-fast-path, compile with low/medium optimization
set(Vtestbench_SUPPORT_SLOW "/Users/gafert/Documents/RISC-V-Simulation/simulation_library/verilated_sources/Vtestbench__Syms.cpp")
# Generated support classes, fast-path, compile with highest optimization
set(Vtestbench_SUPPORT_FAST "/Users/gafert/Documents/RISC-V-Simulation/simulation_library/verilated_sources/Vtestbench__Dpi.cpp")
# All dependencies
set(Vtestbench_DEPS "/usr/local/bin/verilator_bin" "picorv32.v" "testbench.v")
# User .cpp files (from .cpp's on Verilator command line)
set(Vtestbench_USER_CLASSES )
