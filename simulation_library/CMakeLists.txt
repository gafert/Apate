cmake_minimum_required(VERSION 3.15)

project(SimulationLibrary DESCRIPTION "simulation library")

add_library(Vtestbench SHARED pico_simulator.cc bindings.cc)
set_target_properties(Vtestbench
        PROPERTIES
        PUBLIC_HEADER pico_simulator.h
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/../binaries)

# Verilate if there verilator is installed
find_package(verilator HINTS $ENV{VERILATOR_ROOT} ${VERILATOR_ROOT})
if (NOT verilator_FOUND)
    message(WARNING "Verilator was not found. If verilog sources need to be recompiled you need to install verilator.")
else ()
    set(CMAKE_CXX_COMPILER_ID "gcc") # So Verilator compiler correctly
    set(VERILATOR_ARGS "-Wno-fatal") # Prevents Verilator to exit
    verilate(Vtestbench
            SOURCES testbench.v
            DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/verilated_sources)
endif()
