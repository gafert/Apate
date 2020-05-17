// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vtestbench.h for the primary calling header

#include "Vtestbench___024unit.h"
#include "Vtestbench__Syms.h"

#include "verilated_dpi.h"

//==========

VL_CTOR_IMP(Vtestbench___024unit) {
    // Reset internal values
    // Reset structure values
    _ctor_var_reset();
}

void Vtestbench___024unit::__Vconfigure(Vtestbench__Syms* vlSymsp, bool first) {
    if (0 && first) {}  // Prevent unused
    this->__VlSymsp = vlSymsp;
}

Vtestbench___024unit::~Vtestbench___024unit() {
}

VL_INLINE_OPT void Vtestbench___024unit::__Vdpiimwrap_buffer_write_TOP____024unit(const IData/*31:0*/ character) {
    VL_DEBUG_IF(VL_DBG_MSGF("+        Vtestbench___024unit::__Vdpiimwrap_buffer_write_TOP____024unit\n"); );
    // Body
    int character__Vcvt;
    character__Vcvt = character;
    buffer_write(character__Vcvt);
}

void Vtestbench___024unit::_ctor_var_reset() {
    VL_DEBUG_IF(VL_DBG_MSGF("+        Vtestbench___024unit::_ctor_var_reset\n"); );
}
