#include "Vtestbench.h"
#include "verilated.h"
#include "pico_simulator.h"

Vtestbench *top;

uint32_t pc = 0;
uint32_t cpu_state = 0;

//assumes little endian
void print_bits(size_t const size, void const *const ptr) {
    unsigned char *b = (unsigned char *) ptr;
    unsigned char byte;
    int i, j;

    for (i = size - 1; i >= 0; i--) {
        for (j = 7; j >= 0; j--) {
            byte = (b[i] >> j) & 1;
            printf("%u", byte);
        }
    }
}

void advance_simulation_with_statechange() {
    while (!Verilated::gotFinish()) {
        top->clk = !top->clk;
        top->eval();
        if (top->testbench__DOT__uut__DOT__cpu_state != cpu_state) {
            cpu_state = top->testbench__DOT__uut__DOT__cpu_state;
            break;
        }
    }
}

void advance_simulation_with_pc() {
    while (!Verilated::gotFinish()) {
        top->clk = !top->clk;
        top->eval();
        if (top->testbench__DOT__uut__DOT__dbg_next) {
            pc = top->testbench__DOT__uut__DOT__reg_pc;
            top->clk = !top->clk;
            top->eval();
            break;
        }
    }
}

void advance_simulation_with_clock() {
    if (!Verilated::gotFinish()) {
        top->clk = !top->clk;
        top->eval();
        top->clk = !top->clk;
        top->eval();
    }
}

void init_simulation(char *path_to_hex) {
    delete top;
    Verilated::gotFinish(false);
    Verilated::commandArgs(0, (char **) "");
    top = new Vtestbench;

    // Setup sim
    top->clk = 0;

    // Get length
    uint8_t l = 0;
    while (path_to_hex[l] != '\0') {
        l++;
    }
    l--;

    printf("l %d\n", l);

    uint8_t i = 0;
    while (path_to_hex[i] != '\0') {
        ((char *) top->hex_file_name)[l - i] = path_to_hex[i];
        printf("%d %c\n", i, path_to_hex[i]);
        i++;
    }


    top->eval();
}


