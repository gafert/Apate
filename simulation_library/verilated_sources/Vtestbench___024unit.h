// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vtestbench.h for the primary calling header

#ifndef _VTESTBENCH___024UNIT_H_
#define _VTESTBENCH___024UNIT_H_  // guard

#include "verilated_heavy.h"
#include "Vtestbench__Dpi.h"

//==========

class Vtestbench__Syms;

//----------

VL_MODULE(Vtestbench___024unit) {
  public:
    
    // INTERNAL VARIABLES
  private:
    Vtestbench__Syms* __VlSymsp;  // Symbol table
  public:
    
    // CONSTRUCTORS
  private:
    VL_UNCOPYABLE(Vtestbench___024unit);  ///< Copying not allowed
  public:
    Vtestbench___024unit(const char* name = "TOP");
    ~Vtestbench___024unit();
    
    // INTERNAL METHODS
    void __Vconfigure(Vtestbench__Syms* symsp, bool first);
    void __Vdpiimwrap_buffer_write_TOP____024unit(const IData/*31:0*/ character);
  private:
    void _ctor_var_reset() VL_ATTR_COLD;
} VL_ATTR_ALIGNED(VL_CACHE_LINE_BYTES);

//----------


#endif  // guard
