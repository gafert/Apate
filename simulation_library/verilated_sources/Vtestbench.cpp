// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vtestbench.h for the primary calling header

#include "Vtestbench.h"
#include "Vtestbench__Syms.h"

#include "verilated_dpi.h"

//==========

VL_CTOR_IMP(Vtestbench) {
    Vtestbench__Syms* __restrict vlSymsp = __VlSymsp = new Vtestbench__Syms(this, name());
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    VL_CELL(__PVT____024unit, Vtestbench___024unit);
    // Reset internal values
    
    // Reset structure values
    _ctor_var_reset();
}

void Vtestbench::__Vconfigure(Vtestbench__Syms* vlSymsp, bool first) {
    if (0 && first) {}  // Prevent unused
    this->__VlSymsp = vlSymsp;
}

Vtestbench::~Vtestbench() {
    delete __VlSymsp; __VlSymsp=NULL;
}

void Vtestbench::eval_step() {
    VL_DEBUG_IF(VL_DBG_MSGF("+++++TOP Evaluate Vtestbench::eval\n"); );
    Vtestbench__Syms* __restrict vlSymsp = this->__VlSymsp;  // Setup global symbol table
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
#ifdef VL_DEBUG
    // Debug assertions
    _eval_debug_assertions();
#endif  // VL_DEBUG
    // Initialize
    if (VL_UNLIKELY(!vlSymsp->__Vm_didInit)) _eval_initial_loop(vlSymsp);
    // Evaluate till stable
    int __VclockLoop = 0;
    QData __Vchange = 1;
    do {
        VL_DEBUG_IF(VL_DBG_MSGF("+ Clock loop\n"););
        _eval(vlSymsp);
        if (VL_UNLIKELY(++__VclockLoop > 100)) {
            // About to fail, so enable debug to see what's not settling.
            // Note you must run make with OPT=-DVL_DEBUG for debug prints.
            int __Vsaved_debug = Verilated::debug();
            Verilated::debug(1);
            __Vchange = _change_request(vlSymsp);
            Verilated::debug(__Vsaved_debug);
            VL_FATAL_MT("testbench.v", 5, "",
                "Verilated model didn't converge\n"
                "- See DIDNOTCONVERGE in the Verilator manual");
        } else {
            __Vchange = _change_request(vlSymsp);
        }
    } while (VL_UNLIKELY(__Vchange));
}

void Vtestbench::_eval_initial_loop(Vtestbench__Syms* __restrict vlSymsp) {
    vlSymsp->__Vm_didInit = true;
    _eval_initial(vlSymsp);
    // Evaluate till stable
    int __VclockLoop = 0;
    QData __Vchange = 1;
    do {
        _eval_settle(vlSymsp);
        _eval(vlSymsp);
        if (VL_UNLIKELY(++__VclockLoop > 100)) {
            // About to fail, so enable debug to see what's not settling.
            // Note you must run make with OPT=-DVL_DEBUG for debug prints.
            int __Vsaved_debug = Verilated::debug();
            Verilated::debug(1);
            __Vchange = _change_request(vlSymsp);
            Verilated::debug(__Vsaved_debug);
            VL_FATAL_MT("testbench.v", 5, "",
                "Verilated model didn't DC converge\n"
                "- See DIDNOTCONVERGE in the Verilator manual");
        } else {
            __Vchange = _change_request(vlSymsp);
        }
    } while (VL_UNLIKELY(__Vchange));
}

VL_INLINE_OPT void Vtestbench::_sequent__TOP__1(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_sequent__TOP__1\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Variables
    CData/*7:0*/ __Vdlyvval__testbench__DOT__memory__v0;
    CData/*0:0*/ __Vdlyvset__testbench__DOT__memory__v0;
    CData/*7:0*/ __Vdlyvval__testbench__DOT__memory__v1;
    CData/*0:0*/ __Vdlyvset__testbench__DOT__memory__v1;
    CData/*7:0*/ __Vdlyvval__testbench__DOT__memory__v2;
    CData/*0:0*/ __Vdlyvset__testbench__DOT__memory__v2;
    CData/*7:0*/ __Vdlyvval__testbench__DOT__memory__v3;
    CData/*0:0*/ __Vdlyvset__testbench__DOT__memory__v3;
    CData/*1:0*/ __Vdly__testbench__DOT__uut__DOT__mem_state;
    CData/*4:0*/ __Vdlyvdim0__testbench__DOT__uut__DOT__cpuregs__v0;
    CData/*0:0*/ __Vdlyvset__testbench__DOT__uut__DOT__cpuregs__v0;
    CData/*4:0*/ __Vdly__testbench__DOT__uut__DOT__reg_sh;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__decoder_trigger;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__decoder_trigger_q;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__mem_do_rinst;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__latched_is_lu;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__latched_is_lh;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__latched_is_lb;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__mem_do_prefetch;
    CData/*7:0*/ __Vdly__testbench__DOT__uut__DOT__cpu_state;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu;
    CData/*0:0*/ __Vdly__testbench__DOT__uut__DOT__pcpi_mul_wait;
    CData/*6:0*/ __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter;
    SData/*8:0*/ __Vdlyvdim0__testbench__DOT__memory__v0;
    SData/*8:0*/ __Vdlyvdim0__testbench__DOT__memory__v1;
    SData/*8:0*/ __Vdlyvdim0__testbench__DOT__memory__v2;
    SData/*8:0*/ __Vdlyvdim0__testbench__DOT__memory__v3;
    IData/*31:0*/ __Vdlyvval__testbench__DOT__uut__DOT__cpuregs__v0;
    IData/*31:0*/ __Vdly__testbench__DOT__uut__DOT__reg_out;
    IData/*31:0*/ __Vdly__testbench__DOT__uut__DOT__reg_pc;
    IData/*31:0*/ __Vdly__testbench__DOT__uut__DOT__reg_op1;
    IData/*31:0*/ __Vdly__testbench__DOT__uut__DOT__reg_op2;
    // Body
    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter;
    __Vdly__testbench__DOT__uut__DOT__latched_is_lb 
        = vlTOPp->testbench__DOT__uut__DOT__latched_is_lb;
    __Vdly__testbench__DOT__uut__DOT__latched_is_lh 
        = vlTOPp->testbench__DOT__uut__DOT__latched_is_lh;
    __Vdly__testbench__DOT__uut__DOT__latched_is_lu 
        = vlTOPp->testbench__DOT__uut__DOT__latched_is_lu;
    __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger 
        = vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger;
    __Vdly__testbench__DOT__uut__DOT__decoder_trigger_q 
        = vlTOPp->testbench__DOT__uut__DOT__decoder_trigger_q;
    __Vdly__testbench__DOT__uut__DOT__reg_sh = vlTOPp->testbench__DOT__uut__DOT__reg_sh;
    __Vdly__testbench__DOT__uut__DOT__decoder_trigger 
        = vlTOPp->testbench__DOT__uut__DOT__decoder_trigger;
    __Vdly__testbench__DOT__uut__DOT__mem_do_prefetch 
        = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
    __Vdly__testbench__DOT__uut__DOT__reg_pc = vlTOPp->testbench__DOT__uut__DOT__reg_pc;
    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
        = vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst;
    __Vdly__testbench__DOT__uut__DOT__reg_out = vlTOPp->testbench__DOT__uut__DOT__reg_out;
    __Vdly__testbench__DOT__uut__DOT__cpu_state = vlTOPp->testbench__DOT__uut__DOT__cpu_state;
    __Vdlyvset__testbench__DOT__uut__DOT__cpuregs__v0 = 0U;
    __Vdly__testbench__DOT__uut__DOT__reg_op2 = vlTOPp->testbench__DOT__uut__DOT__reg_op2;
    __Vdly__testbench__DOT__uut__DOT__reg_op1 = vlTOPp->testbench__DOT__uut__DOT__reg_op1;
    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu;
    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh;
    __Vdly__testbench__DOT__uut__DOT__mem_state = vlTOPp->testbench__DOT__uut__DOT__mem_state;
    __Vdly__testbench__DOT__uut__DOT__pcpi_mul_wait 
        = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wait;
    __Vdlyvset__testbench__DOT__memory__v0 = 0U;
    __Vdlyvset__testbench__DOT__memory__v1 = 0U;
    __Vdlyvset__testbench__DOT__memory__v2 = 0U;
    __Vdlyvset__testbench__DOT__memory__v3 = 0U;
    if (VL_UNLIKELY(((IData)(vlTOPp->testbench__DOT__resetn) 
                     & (IData)(vlTOPp->testbench__DOT__trap)))) {
        VL_FINISH_MT("testbench.v", 95, "");
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__decoded_rs1 
            = (0x1fU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                        >> 0xfU));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_timer = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_maskirq = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_setq = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_getq = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_rdinstrh = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_rdcycle = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_rdinstr = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_rdcycleh = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_waitirq = 0U;
    }
    if (vlTOPp->testbench__DOT__resetn) {
        vlTOPp->testbench__DOT__next_x32 = vlTOPp->testbench__DOT__x32;
        vlTOPp->testbench__DOT__next_x32 = (vlTOPp->testbench__DOT__next_x32 
                                            ^ (vlTOPp->testbench__DOT__next_x32 
                                               << 0xdU));
        vlTOPp->testbench__DOT__next_x32 = (vlTOPp->testbench__DOT__next_x32 
                                            ^ (vlTOPp->testbench__DOT__next_x32 
                                               >> 0x11U));
        vlTOPp->testbench__DOT__next_x32 = (vlTOPp->testbench__DOT__next_x32 
                                            ^ (vlTOPp->testbench__DOT__next_x32 
                                               << 5U));
        vlTOPp->testbench__DOT__x32 = vlTOPp->testbench__DOT__next_x32;
    }
    vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wr = 0U;
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish) 
         & (IData)(vlTOPp->testbench__DOT__resetn))) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wr = 1U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish) 
         & (IData)(vlTOPp->testbench__DOT__resetn))) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_rd 
            = (IData)(((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh)
                        ? (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd 
                           >> 0x20U) : vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd));
    }
    if ((((IData)(vlTOPp->testbench__DOT__resetn) & (IData)(vlTOPp->testbench__DOT__uut__DOT__cpuregs_write)) 
         & (0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_rd)))) {
        __Vdlyvval__testbench__DOT__uut__DOT__cpuregs__v0 
            = vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata;
        __Vdlyvset__testbench__DOT__uut__DOT__cpuregs__v0 = 1U;
        __Vdlyvdim0__testbench__DOT__uut__DOT__cpuregs__v0 
            = vlTOPp->testbench__DOT__uut__DOT__latched_rd;
    }
    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu = 0U;
    if (((((IData)(vlTOPp->testbench__DOT__resetn) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__pcpi_valid)) 
          & (0x33U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__pcpi_insn))) 
         & (1U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                            >> 0x19U))))) {
        if ((0U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                          >> 0xcU)))) {
            if ((1U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                              >> 0xcU)))) {
                if ((2U == (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                                  >> 0xcU)))) {
                    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu = 1U;
                }
            }
        }
    }
    __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh = 0U;
    if (((((IData)(vlTOPp->testbench__DOT__resetn) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__pcpi_valid)) 
          & (0x33U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__pcpi_insn))) 
         & (1U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                            >> 0x19U))))) {
        if ((0U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                          >> 0xcU)))) {
            if ((1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                              >> 0xcU)))) {
                __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh = 1U;
            }
        }
    }
    __Vdly__testbench__DOT__uut__DOT__pcpi_mul_wait 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mul) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh) 
              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu) 
                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu))));
    if (((IData)(vlTOPp->testbench__DOT__mem_valid) 
         & (IData)(vlTOPp->testbench__DOT__mem_ready))) {
        if (VL_UNLIKELY(((0U != (IData)(vlTOPp->testbench__DOT__mem_wstrb)) 
                         & (0x10000000U == vlTOPp->testbench__DOT__mem_addr)))) {
            VL_WRITEF("%c",8,(0xffU & vlTOPp->testbench__DOT__mem_wdata));
            VL_WRITEF("%10#\n",32,vlTOPp->testbench__DOT__mem_wdata);
            vlSymsp->TOP____024unit.__Vdpiimwrap_buffer_write_TOP____024unit(
                                                                             (0xffU 
                                                                              & vlTOPp->testbench__DOT__mem_wdata));
        } else {
            if ((1U & (IData)(vlTOPp->testbench__DOT__mem_wstrb))) {
                __Vdlyvval__testbench__DOT__memory__v0 
                    = (0xffU & vlTOPp->testbench__DOT__mem_wdata);
                __Vdlyvset__testbench__DOT__memory__v0 = 1U;
                __Vdlyvdim0__testbench__DOT__memory__v0 
                    = (0x1ffU & vlTOPp->testbench__DOT__mem_addr);
            }
            if ((2U & (IData)(vlTOPp->testbench__DOT__mem_wstrb))) {
                __Vdlyvval__testbench__DOT__memory__v1 
                    = (0xffU & (vlTOPp->testbench__DOT__mem_wdata 
                                >> 8U));
                __Vdlyvset__testbench__DOT__memory__v1 = 1U;
                __Vdlyvdim0__testbench__DOT__memory__v1 
                    = (0x1ffU & ((IData)(1U) + vlTOPp->testbench__DOT__mem_addr));
            }
            if ((4U & (IData)(vlTOPp->testbench__DOT__mem_wstrb))) {
                __Vdlyvval__testbench__DOT__memory__v2 
                    = (0xffU & (vlTOPp->testbench__DOT__mem_wdata 
                                >> 0x10U));
                __Vdlyvset__testbench__DOT__memory__v2 = 1U;
                __Vdlyvdim0__testbench__DOT__memory__v2 
                    = (0x1ffU & ((IData)(2U) + vlTOPp->testbench__DOT__mem_addr));
            }
            if ((8U & (IData)(vlTOPp->testbench__DOT__mem_wstrb))) {
                __Vdlyvval__testbench__DOT__memory__v3 
                    = (0xffU & (vlTOPp->testbench__DOT__mem_wdata 
                                >> 0x18U));
                __Vdlyvset__testbench__DOT__memory__v3 = 1U;
                __Vdlyvdim0__testbench__DOT__memory__v3 
                    = (0x1ffU & ((IData)(3U) + vlTOPp->testbench__DOT__mem_addr));
            }
        }
    }
    if (__Vdlyvset__testbench__DOT__uut__DOT__cpuregs__v0) {
        vlTOPp->testbench__DOT__uut__DOT__cpuregs[__Vdlyvdim0__testbench__DOT__uut__DOT__cpuregs__v0] 
            = __Vdlyvval__testbench__DOT__uut__DOT__cpuregs__v0;
    }
    if (__Vdlyvset__testbench__DOT__memory__v0) {
        vlTOPp->testbench__DOT__memory[__Vdlyvdim0__testbench__DOT__memory__v0] 
            = __Vdlyvval__testbench__DOT__memory__v0;
    }
    if (__Vdlyvset__testbench__DOT__memory__v1) {
        vlTOPp->testbench__DOT__memory[__Vdlyvdim0__testbench__DOT__memory__v1] 
            = __Vdlyvval__testbench__DOT__memory__v1;
    }
    if (__Vdlyvset__testbench__DOT__memory__v2) {
        vlTOPp->testbench__DOT__memory[__Vdlyvdim0__testbench__DOT__memory__v2] 
            = __Vdlyvval__testbench__DOT__memory__v2;
    }
    if (__Vdlyvset__testbench__DOT__memory__v3) {
        vlTOPp->testbench__DOT__memory[__Vdlyvdim0__testbench__DOT__memory__v3] 
            = __Vdlyvval__testbench__DOT__memory__v3;
    }
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mul = 0U;
    if (((((IData)(vlTOPp->testbench__DOT__resetn) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__pcpi_valid)) 
          & (0x33U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__pcpi_insn))) 
         & (1U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                            >> 0x19U))))) {
        if ((0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                          >> 0xcU)))) {
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mul = 1U;
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu = 0U;
    if (((((IData)(vlTOPp->testbench__DOT__resetn) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__pcpi_valid)) 
          & (0x33U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__pcpi_insn))) 
         & (1U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                            >> 0x19U))))) {
        if ((0U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                          >> 0xcU)))) {
            if ((1U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                              >> 0xcU)))) {
                if ((2U != (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                                  >> 0xcU)))) {
                    if ((3U == (7U & (vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
                                      >> 0xcU)))) {
                        vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu = 1U;
                    }
                }
            }
        }
    }
    if ((1U & (~ ((~ (IData)(vlTOPp->testbench__DOT__resetn)) 
                  | (IData)(vlTOPp->testbench__DOT__trap))))) {
        if (vlTOPp->testbench__DOT__uut__DOT__mem_la_write) {
            vlTOPp->testbench__DOT__mem_wdata = vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata;
        }
    }
    if ((1U & ((~ (IData)(vlTOPp->testbench__DOT__resetn)) 
               | (IData)(vlTOPp->testbench__DOT__trap)))) {
        if ((1U & (~ (IData)(vlTOPp->testbench__DOT__resetn)))) {
            __Vdly__testbench__DOT__uut__DOT__mem_state = 0U;
        }
        if ((1U & ((~ (IData)(vlTOPp->testbench__DOT__resetn)) 
                   | (IData)(vlTOPp->testbench__DOT__mem_ready)))) {
            vlTOPp->testbench__DOT__mem_valid = 0U;
        }
    } else {
        if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_read) 
             | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_write))) {
            vlTOPp->testbench__DOT__mem_wstrb = ((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb) 
                                                 & VL_NEGATE_I((IData)((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_write))));
        }
        if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) {
            if ((((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch) 
                  | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst)) 
                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata))) {
                vlTOPp->testbench__DOT__mem_valid = 1U;
                vlTOPp->testbench__DOT__mem_wstrb = 0U;
                __Vdly__testbench__DOT__uut__DOT__mem_state = 1U;
            }
            if (vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata) {
                vlTOPp->testbench__DOT__mem_valid = 1U;
                __Vdly__testbench__DOT__uut__DOT__mem_state = 2U;
            }
        } else {
            if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) {
                if (vlTOPp->testbench__DOT__uut__DOT__mem_xfer) {
                    vlTOPp->testbench__DOT__mem_valid = 0U;
                    __Vdly__testbench__DOT__uut__DOT__mem_state 
                        = (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
                            | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata))
                            ? 0U : 3U);
                }
            } else {
                if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) {
                    if (vlTOPp->testbench__DOT__uut__DOT__mem_xfer) {
                        vlTOPp->testbench__DOT__mem_valid = 0U;
                        __Vdly__testbench__DOT__uut__DOT__mem_state = 0U;
                    }
                } else {
                    if ((3U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) {
                        if (vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) {
                            __Vdly__testbench__DOT__uut__DOT__mem_state = 0U;
                        }
                    }
                }
            }
        }
    }
    if ((1U & (~ ((~ (IData)(vlTOPp->testbench__DOT__resetn)) 
                  | (IData)(vlTOPp->testbench__DOT__trap))))) {
        if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_read) 
             | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_la_write))) {
            vlTOPp->testbench__DOT__mem_addr = (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch) 
                                                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst))
                                                 ? 
                                                (0xfffffffcU 
                                                 & vlTOPp->testbench__DOT__uut__DOT__next_pc)
                                                 : 
                                                (0xfffffffcU 
                                                 & vlTOPp->testbench__DOT__uut__DOT__reg_op1));
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__mem_state = __Vdly__testbench__DOT__uut__DOT__mem_state;
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_insn 
            = vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q;
    }
    vlTOPp->testbench__DOT__mem_ready = (vlTOPp->testbench__DOT__x32 
                                         & (IData)(vlTOPp->testbench__DOT__mem_valid));
    vlTOPp->testbench__DOT__trap = 0U;
    __Vdly__testbench__DOT__uut__DOT__reg_sh = 0U;
    __Vdly__testbench__DOT__uut__DOT__reg_out = 0U;
    vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rinst = 0U;
    vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rdata = 0U;
    vlTOPp->testbench__DOT__uut__DOT__set_mem_do_wdata = 0U;
    __Vdly__testbench__DOT__uut__DOT__decoder_trigger 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done));
    __Vdly__testbench__DOT__uut__DOT__decoder_trigger_q 
        = vlTOPp->testbench__DOT__uut__DOT__decoder_trigger;
    __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger = 0U;
    if (vlTOPp->testbench__DOT__resetn) {
        if (((((((((0x80U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state)) 
                   | (0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
                  | (0x20U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
                 | (0x10U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
                | (8U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
               | (4U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
              | (2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) 
             | (1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state)))) {
            if ((0x80U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                vlTOPp->testbench__DOT__trap = 1U;
            } else {
                if ((0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                        = (1U & ((~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger)) 
                                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__do_waitirq))));
                    vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 0U;
                    __Vdly__testbench__DOT__uut__DOT__latched_is_lu = 0U;
                    __Vdly__testbench__DOT__uut__DOT__latched_is_lh = 0U;
                    __Vdly__testbench__DOT__uut__DOT__latched_is_lb = 0U;
                    vlTOPp->testbench__DOT__uut__DOT__latched_rd 
                        = vlTOPp->testbench__DOT__uut__DOT__decoded_rd;
                    vlTOPp->testbench__DOT__uut__DOT__latched_compr 
                        = vlTOPp->testbench__DOT__uut__DOT__compressed_instr;
                    vlTOPp->testbench__DOT__uut__DOT__current_pc 
                        = vlTOPp->testbench__DOT__uut__DOT__reg_next_pc;
                    if (vlTOPp->testbench__DOT__uut__DOT__latched_branch) {
                        vlTOPp->testbench__DOT__uut__DOT__current_pc 
                            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store)
                                ? (0xfffffffeU & ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_stalu)
                                                   ? vlTOPp->testbench__DOT__uut__DOT__alu_out_q
                                                   : vlTOPp->testbench__DOT__uut__DOT__reg_out))
                                : vlTOPp->testbench__DOT__uut__DOT__reg_next_pc);
                    }
                    __Vdly__testbench__DOT__uut__DOT__reg_pc 
                        = vlTOPp->testbench__DOT__uut__DOT__current_pc;
                    vlTOPp->testbench__DOT__uut__DOT__reg_next_pc 
                        = vlTOPp->testbench__DOT__uut__DOT__current_pc;
                    vlTOPp->testbench__DOT__uut__DOT__latched_store = 0U;
                    vlTOPp->testbench__DOT__uut__DOT__latched_stalu = 0U;
                    vlTOPp->testbench__DOT__uut__DOT__latched_branch = 0U;
                    if (vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) {
                        vlTOPp->testbench__DOT__uut__DOT__reg_next_pc 
                            = (vlTOPp->testbench__DOT__uut__DOT__current_pc 
                               + ((IData)(vlTOPp->testbench__DOT__uut__DOT__compressed_instr)
                                   ? 2U : 4U));
                        if (vlTOPp->testbench__DOT__uut__DOT__instr_jal) {
                            __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                            vlTOPp->testbench__DOT__uut__DOT__reg_next_pc 
                                = (vlTOPp->testbench__DOT__uut__DOT__current_pc 
                                   + vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j);
                            vlTOPp->testbench__DOT__uut__DOT__latched_branch = 1U;
                        } else {
                            __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 0U;
                            __Vdly__testbench__DOT__uut__DOT__mem_do_prefetch 
                                = (1U & ((~ (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr)) 
                                         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_retirq))));
                            __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x20U;
                        }
                    }
                } else {
                    if ((0x20U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                        __Vdly__testbench__DOT__uut__DOT__reg_op1 = 0U;
                        __Vdly__testbench__DOT__uut__DOT__reg_op2 = 0U;
                        if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_trap) 
                             | (IData)(vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal))) {
                            if (vlTOPp->testbench__DOT__uut__DOT__instr_trap) {
                                __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                    = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                vlTOPp->testbench__DOT__uut__DOT__pcpi_valid = 1U;
                                __Vdly__testbench__DOT__uut__DOT__reg_sh 
                                    = (0x1fU & vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2);
                                __Vdly__testbench__DOT__uut__DOT__reg_op2 
                                    = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2;
                                if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
                                    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                                    vlTOPp->testbench__DOT__uut__DOT__pcpi_valid = 0U;
                                    __Vdly__testbench__DOT__uut__DOT__reg_out 
                                        = vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store 
                                        = vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                }
                            } else {
                                if (vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal) {
                                    __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui)
                                            ? 0U : vlTOPp->testbench__DOT__uut__DOT__reg_pc);
                                    __Vdly__testbench__DOT__uut__DOT__reg_op2 
                                        = vlTOPp->testbench__DOT__uut__DOT__decoded_imm;
                                    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                                        = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 8U;
                                } else {
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store = 1U;
                                    __Vdly__testbench__DOT__uut__DOT__reg_out 
                                        = vlTOPp->testbench__DOT__uut__DOT__timer;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                    vlTOPp->testbench__DOT__uut__DOT__timer 
                                        = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                }
                            }
                        } else {
                            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
                                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_trap)))) {
                                __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                    = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                __Vdly__testbench__DOT__uut__DOT__cpu_state = 1U;
                                __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                            } else {
                                if (vlTOPp->testbench__DOT__uut__DOT__is_slli_srli_srai) {
                                    __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                        = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                    __Vdly__testbench__DOT__uut__DOT__reg_sh 
                                        = vlTOPp->testbench__DOT__uut__DOT__decoded_rs2;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 4U;
                                } else {
                                    if (vlTOPp->testbench__DOT__uut__DOT__is_jalr_addi_slti_sltiu_xori_ori_andi) {
                                        __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                            = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                        __Vdly__testbench__DOT__uut__DOT__reg_op2 
                                            = vlTOPp->testbench__DOT__uut__DOT__decoded_imm;
                                        __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                                            = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
                                        __Vdly__testbench__DOT__uut__DOT__cpu_state = 8U;
                                    } else {
                                        __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                            = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1;
                                        __Vdly__testbench__DOT__uut__DOT__reg_sh 
                                            = (0x1fU 
                                               & vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2);
                                        __Vdly__testbench__DOT__uut__DOT__reg_op2 
                                            = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2;
                                        if (vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw) {
                                            __Vdly__testbench__DOT__uut__DOT__cpu_state = 2U;
                                            __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                                        } else {
                                            if (vlTOPp->testbench__DOT__uut__DOT__is_sll_srl_sra) {
                                                __Vdly__testbench__DOT__uut__DOT__cpu_state = 4U;
                                            } else {
                                                __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                                                    = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
                                                __Vdly__testbench__DOT__uut__DOT__cpu_state = 8U;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if ((0x10U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                            __Vdly__testbench__DOT__uut__DOT__reg_sh 
                                = (0x1fU & vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2);
                            __Vdly__testbench__DOT__uut__DOT__reg_op2 
                                = vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2;
                            if (vlTOPp->testbench__DOT__uut__DOT__instr_trap) {
                                vlTOPp->testbench__DOT__uut__DOT__pcpi_valid = 1U;
                                if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
                                    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                                    vlTOPp->testbench__DOT__uut__DOT__pcpi_valid = 0U;
                                    __Vdly__testbench__DOT__uut__DOT__reg_out 
                                        = vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store 
                                        = vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                }
                            } else {
                                if (vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw) {
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 2U;
                                    __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
                                } else {
                                    if (vlTOPp->testbench__DOT__uut__DOT__is_sll_srl_sra) {
                                        __Vdly__testbench__DOT__uut__DOT__cpu_state = 4U;
                                    } else {
                                        __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                                            = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
                                        __Vdly__testbench__DOT__uut__DOT__cpu_state = 8U;
                                    }
                                }
                            }
                        } else {
                            if ((8U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                                __Vdly__testbench__DOT__uut__DOT__reg_out 
                                    = (vlTOPp->testbench__DOT__uut__DOT__reg_pc 
                                       + vlTOPp->testbench__DOT__uut__DOT__decoded_imm);
                                if (vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) {
                                    vlTOPp->testbench__DOT__uut__DOT__latched_rd = 0U;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store 
                                        = vlTOPp->testbench__DOT__uut__DOT__alu_out_0;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_branch 
                                        = vlTOPp->testbench__DOT__uut__DOT__alu_out_0;
                                    if (vlTOPp->testbench__DOT__uut__DOT__mem_done) {
                                        __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                    }
                                    if (vlTOPp->testbench__DOT__uut__DOT__alu_out_0) {
                                        vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rinst = 1U;
                                        __Vdly__testbench__DOT__uut__DOT__decoder_trigger = 0U;
                                    }
                                } else {
                                    vlTOPp->testbench__DOT__uut__DOT__latched_branch 
                                        = vlTOPp->testbench__DOT__uut__DOT__instr_jalr;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store = 1U;
                                    vlTOPp->testbench__DOT__uut__DOT__latched_stalu = 1U;
                                    __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                }
                            } else {
                                if ((4U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                                    vlTOPp->testbench__DOT__uut__DOT__latched_store = 1U;
                                    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__reg_sh))) {
                                        __Vdly__testbench__DOT__uut__DOT__reg_out 
                                            = vlTOPp->testbench__DOT__uut__DOT__reg_op1;
                                        __Vdly__testbench__DOT__uut__DOT__mem_do_rinst 
                                            = vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch;
                                        __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                    } else {
                                        if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slli) 
                                             | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sll))) {
                                            __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                                = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                   << 1U);
                                        } else {
                                            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srli) 
                                                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srl))) {
                                                __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                                    = 
                                                    (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                     >> 1U);
                                            } else {
                                                if (
                                                    ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srai) 
                                                     | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sra))) {
                                                    __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                                        = 
                                                        VL_SHIFTRS_III(32,32,32, vlTOPp->testbench__DOT__uut__DOT__reg_op1, 1U);
                                                }
                                            }
                                        }
                                        __Vdly__testbench__DOT__uut__DOT__reg_sh 
                                            = (0x1fU 
                                               & ((IData)(vlTOPp->testbench__DOT__uut__DOT__reg_sh) 
                                                  - (IData)(1U)));
                                    }
                                } else {
                                    if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
                                        if ((1U & (
                                                   (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
                                                   | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done)))) {
                                            if ((1U 
                                                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata)))) {
                                                __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                                    = 
                                                    (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                     + vlTOPp->testbench__DOT__uut__DOT__decoded_imm);
                                                vlTOPp->testbench__DOT__uut__DOT__set_mem_do_wdata = 1U;
                                                if (vlTOPp->testbench__DOT__uut__DOT__instr_sb) {
                                                    vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 2U;
                                                } else {
                                                    if (vlTOPp->testbench__DOT__uut__DOT__instr_sh) {
                                                        vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 1U;
                                                    } else {
                                                        if (vlTOPp->testbench__DOT__uut__DOT__instr_sw) {
                                                            vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 0U;
                                                        }
                                                    }
                                                }
                                            }
                                            if (((~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
                                                 & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
                                                __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                                __Vdly__testbench__DOT__uut__DOT__decoder_trigger = 1U;
                                                __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger = 1U;
                                            }
                                        }
                                    } else {
                                        vlTOPp->testbench__DOT__uut__DOT__latched_store = 1U;
                                        if ((1U & (
                                                   (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
                                                   | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done)))) {
                                            if (((~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
                                                 & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
                                                if (vlTOPp->testbench__DOT__uut__DOT__latched_is_lu) {
                                                    __Vdly__testbench__DOT__uut__DOT__reg_out 
                                                        = vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word;
                                                } else {
                                                    if (vlTOPp->testbench__DOT__uut__DOT__latched_is_lh) {
                                                        __Vdly__testbench__DOT__uut__DOT__reg_out 
                                                            = 
                                                            VL_EXTENDS_II(32,16, 
                                                                          (0xffffU 
                                                                           & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word));
                                                    } else {
                                                        if (vlTOPp->testbench__DOT__uut__DOT__latched_is_lb) {
                                                            __Vdly__testbench__DOT__uut__DOT__reg_out 
                                                                = 
                                                                VL_EXTENDS_II(32,8, 
                                                                              (0xffU 
                                                                               & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word));
                                                        }
                                                    }
                                                }
                                                __Vdly__testbench__DOT__uut__DOT__decoder_trigger = 1U;
                                                __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger = 1U;
                                                __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
                                            }
                                            if ((1U 
                                                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata)))) {
                                                __Vdly__testbench__DOT__uut__DOT__reg_op1 
                                                    = 
                                                    (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                     + vlTOPp->testbench__DOT__uut__DOT__decoded_imm);
                                                vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rdata = 1U;
                                                if (
                                                    ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lb) 
                                                     | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lbu))) {
                                                    vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 2U;
                                                } else {
                                                    if (
                                                        ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lh) 
                                                         | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lhu))) {
                                                        vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 1U;
                                                    } else {
                                                        if (vlTOPp->testbench__DOT__uut__DOT__instr_lw) {
                                                            vlTOPp->testbench__DOT__uut__DOT__mem_wordsize = 0U;
                                                        }
                                                    }
                                                }
                                                __Vdly__testbench__DOT__uut__DOT__latched_is_lu 
                                                    = vlTOPp->testbench__DOT__uut__DOT__is_lbu_lhu_lw;
                                                __Vdly__testbench__DOT__uut__DOT__latched_is_lh 
                                                    = vlTOPp->testbench__DOT__uut__DOT__instr_lh;
                                                __Vdly__testbench__DOT__uut__DOT__latched_is_lb 
                                                    = vlTOPp->testbench__DOT__uut__DOT__instr_lb;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        vlTOPp->testbench__DOT__uut__DOT__timer = 0U;
        __Vdly__testbench__DOT__uut__DOT__reg_pc = 0U;
        vlTOPp->testbench__DOT__uut__DOT__reg_next_pc = 0U;
        vlTOPp->testbench__DOT__uut__DOT__latched_store = 0U;
        vlTOPp->testbench__DOT__uut__DOT__latched_stalu = 0U;
        vlTOPp->testbench__DOT__uut__DOT__latched_branch = 0U;
        __Vdly__testbench__DOT__uut__DOT__latched_is_lu = 0U;
        __Vdly__testbench__DOT__uut__DOT__latched_is_lh = 0U;
        __Vdly__testbench__DOT__uut__DOT__latched_is_lb = 0U;
        vlTOPp->testbench__DOT__uut__DOT__pcpi_valid = 0U;
        __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x40U;
    }
    if ((((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger_q) 
          & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger_q))) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_ecall_ebreak))) {
        __Vdly__testbench__DOT__uut__DOT__cpu_state = 0x80U;
    }
    if ((1U & ((~ (IData)(vlTOPp->testbench__DOT__resetn)) 
               | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done)))) {
        __Vdly__testbench__DOT__uut__DOT__mem_do_prefetch = 0U;
        __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 0U;
        vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata = 0U;
        vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata = 0U;
    }
    if (vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rinst) {
        __Vdly__testbench__DOT__uut__DOT__mem_do_rinst = 1U;
    }
    if (vlTOPp->testbench__DOT__uut__DOT__set_mem_do_rdata) {
        vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata = 1U;
    }
    if (vlTOPp->testbench__DOT__uut__DOT__set_mem_do_wdata) {
        vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata = 1U;
    }
    __Vdly__testbench__DOT__uut__DOT__reg_pc = (0xfffffffcU 
                                                & __Vdly__testbench__DOT__uut__DOT__reg_pc);
    vlTOPp->testbench__DOT__uut__DOT__reg_next_pc = 
        (0xfffffffcU & vlTOPp->testbench__DOT__uut__DOT__reg_next_pc);
    vlTOPp->testbench__DOT__uut__DOT__current_pc = 0U;
    vlTOPp->testbench__DOT__uut__DOT__reg_sh = __Vdly__testbench__DOT__uut__DOT__reg_sh;
    vlTOPp->testbench__DOT__uut__DOT__decoder_trigger_q 
        = __Vdly__testbench__DOT__uut__DOT__decoder_trigger_q;
    vlTOPp->testbench__DOT__uut__DOT__latched_is_lu 
        = __Vdly__testbench__DOT__uut__DOT__latched_is_lu;
    vlTOPp->testbench__DOT__uut__DOT__latched_is_lh 
        = __Vdly__testbench__DOT__uut__DOT__latched_is_lh;
    vlTOPp->testbench__DOT__uut__DOT__latched_is_lb 
        = __Vdly__testbench__DOT__uut__DOT__latched_is_lb;
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1 = 
        ((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__decoded_rs1))
          ? vlTOPp->testbench__DOT__uut__DOT__cpuregs
         [vlTOPp->testbench__DOT__uut__DOT__decoded_rs1]
          : 0U);
    vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch 
        = __Vdly__testbench__DOT__uut__DOT__mem_do_prefetch;
    vlTOPp->testbench__DOT__uut__DOT__reg_pc = __Vdly__testbench__DOT__uut__DOT__reg_pc;
    vlTOPp->testbench__DOT__uut__DOT__reg_out = __Vdly__testbench__DOT__uut__DOT__reg_out;
    vlTOPp->testbench__DOT__uut__DOT__cpu_state = __Vdly__testbench__DOT__uut__DOT__cpu_state;
    vlTOPp->testbench__DOT__uut__DOT__do_waitirq = 0U;
    vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger_q 
        = vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger;
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 0U;
    if ((0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
        if (vlTOPp->testbench__DOT__uut__DOT__latched_branch) {
            vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 1U;
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch)))) {
                vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 1U;
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__next_pc = (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                                                  & (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch))
                                                  ? 
                                                 (0xfffffffeU 
                                                  & vlTOPp->testbench__DOT__uut__DOT__reg_out)
                                                  : vlTOPp->testbench__DOT__uut__DOT__reg_next_pc);
    vlTOPp->testbench__DOT__uut__DOT__alu_out_q = vlTOPp->testbench__DOT__uut__DOT__alu_out;
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__compressed_instr = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__decoded_rd 
            = (0x1fU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                        >> 7U));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__decoded_rs2 
            = (0x1fU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                        >> 0x14U));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_retirq = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_ecall_ebreak 
            = (((0x73U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q)) 
                & (~ (IData)((0U != (0x7ffU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                               >> 0x15U)))))) 
               & (~ (IData)((0U != (0x1fffU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                               >> 7U))))));
    }
    vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready = 0U;
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish) 
         & (IData)(vlTOPp->testbench__DOT__resetn))) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready = 1U;
    }
    vlTOPp->testbench__DOT__uut__DOT__is_lbu_lhu_lw 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lbu) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lhu) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lw)));
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata = 0U;
    if ((0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
        if (vlTOPp->testbench__DOT__uut__DOT__latched_branch) {
            vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata 
                = (vlTOPp->testbench__DOT__uut__DOT__reg_pc 
                   + ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_compr)
                       ? 2U : 4U));
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch)))) {
                vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata 
                    = ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_stalu)
                        ? vlTOPp->testbench__DOT__uut__DOT__alu_out_q
                        : vlTOPp->testbench__DOT__uut__DOT__reg_out);
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2 = 
        ((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__decoded_rs2))
          ? vlTOPp->testbench__DOT__uut__DOT__cpuregs
         [vlTOPp->testbench__DOT__uut__DOT__decoded_rs2]
          : 0U);
    vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr 
            = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wr;
    }
    vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd 
            = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_rd;
    }
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish = 0U;
    if (vlTOPp->testbench__DOT__resetn) {
        if (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting) {
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1 
                = (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh) 
                    | (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu))
                    ? VL_EXTENDS_QI(64,32, vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                    : (QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__reg_op1)));
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2 
                = ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh)
                    ? VL_EXTENDS_QI(64,32, vlTOPp->testbench__DOT__uut__DOT__reg_op2)
                    : (QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__reg_op2)));
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd = VL_ULL(0);
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx = VL_ULL(0);
            __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter 
                = ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh)
                    ? 0x3eU : 0x1eU);
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting 
                = (1U & (~ ((IData)(vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wait) 
                            & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__pcpi_wait_q)))));
        } else {
            __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter 
                = (0x7fU & ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter) 
                            - (IData)(1U)));
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd 
                = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd;
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx 
                = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx;
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1 
                = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1;
            vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2 
                = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2;
            if ((0x40U & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter))) {
                vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish = 1U;
                vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting = 1U;
            }
        }
    } else {
        vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting = 1U;
    }
    vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_auipc) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jal)));
    vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_auipc) 
              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jal) 
                 | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr) 
                    | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_addi) 
                       | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_add) 
                          | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sub)))))));
    vlTOPp->testbench__DOT__uut__DOT__is_slti_blt_slt 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slti) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_blt) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slt)));
    vlTOPp->testbench__DOT__uut__DOT__is_sltiu_bltu_sltu 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltiu) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bltu) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltu)));
    vlTOPp->testbench__DOT__uut__DOT__is_compare = 
        ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slti) 
            | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slt) 
               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltiu) 
                  | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltu)))));
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_beq 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_bne 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_blt 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (4U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_bge 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_bltu 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (6U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_bgeu 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu) 
               & (7U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_lb 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
               & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_lh 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
               & (1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_lw 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
               & (2U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_lbu 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
               & (4U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_lhu 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
               & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sb 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw) 
               & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sh 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw) 
               & (1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sw 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw) 
               & (2U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_addi 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_slti 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (2U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sltiu 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (3U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_xori 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (4U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_ori 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (6U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_andi 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (7U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                               >> 0xcU))));
        vlTOPp->testbench__DOT__uut__DOT__instr_slli 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
                & (1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_srli 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
                & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_srai 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
                & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0x20U 
                                               == (0x7fU 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__is_slli_srli_srai 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
               & (((1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                 >> 0xcU))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U)))) 
                  | (((5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                    >> 0xcU))) & (0U 
                                                  == 
                                                  (0x7fU 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0x19U)))) 
                     | ((5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                      >> 0xcU))) & 
                        (0x20U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                            >> 0x19U)))))));
        vlTOPp->testbench__DOT__uut__DOT__is_jalr_addi_slti_sltiu_xori_ori_andi 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr) 
               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm) 
                  & ((0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                   >> 0xcU))) | ((2U 
                                                  == 
                                                  (7U 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0xcU))) 
                                                 | ((3U 
                                                     == 
                                                     (7U 
                                                      & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                         >> 0xcU))) 
                                                    | ((4U 
                                                        == 
                                                        (7U 
                                                         & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                            >> 0xcU))) 
                                                       | ((6U 
                                                           == 
                                                           (7U 
                                                            & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                               >> 0xcU))) 
                                                          | (7U 
                                                             == 
                                                             (7U 
                                                              & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                                 >> 0xcU))))))))));
        vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub = 0U;
        vlTOPp->testbench__DOT__uut__DOT__is_compare = 0U;
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jal)
                ? vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j
                : (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui) 
                    | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_auipc))
                    ? (0xfffff000U & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q)
                    : (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr) 
                        | ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu) 
                           | (IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm)))
                        ? VL_EXTENDS_II(32,12, (0xfffU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x14U)))
                        : ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu)
                            ? VL_EXTENDS_II(32,13, 
                                            ((0x1000U 
                                              & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                 >> 0x13U)) 
                                             | ((0x800U 
                                                 & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                    << 4U)) 
                                                | ((0x7e0U 
                                                    & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                       >> 0x14U)) 
                                                   | (0x1eU 
                                                      & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                         >> 7U))))))
                            : ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw)
                                ? VL_EXTENDS_II(32,12, 
                                                ((0xfe0U 
                                                  & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                     >> 0x14U)) 
                                                 | (0x1fU 
                                                    & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                       >> 7U))))
                                : 0U)))));
    }
    if ((1U & (~ (IData)(vlTOPp->testbench__DOT__resetn)))) {
        vlTOPp->testbench__DOT__uut__DOT__is_compare = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_beq = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_bne = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_blt = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_bge = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_bltu = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_bgeu = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_addi = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_slti = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_sltiu = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_xori = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_ori = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_andi = 0U;
    }
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter 
        = __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh 
        = __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu 
        = __Vdly__testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu;
    vlTOPp->testbench__DOT__uut__DOT__reg_op2 = __Vdly__testbench__DOT__uut__DOT__reg_op2;
    vlTOPp->testbench__DOT__uut__DOT__reg_op1 = __Vdly__testbench__DOT__uut__DOT__reg_op1;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__pcpi_wait_q 
        = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wait;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
        = ((1U & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1))
            ? vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2
            : VL_ULL(0));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt = VL_ULL(0);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd)) 
                   + (0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx))) 
                  + (0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2))) 
                 >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
                    + (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx)) 
                   + (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffffffff7) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 3U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffffff0) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | (IData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 4U))) + (0xfU 
                                                & (IData)(
                                                          (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                           >> 4U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 4U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 4U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                >> 4U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 4U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffffffff7f) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 7U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffffffff0f) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 8U))) + (0xfU 
                                                & (IData)(
                                                          (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                           >> 8U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 8U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 8U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                >> 8U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 8U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffffff7ff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0xbU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffff0ff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 8U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0xcU))) + (0xfU 
                                                  & (IData)(
                                                            (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                             >> 0xcU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0xcU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0xcU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                  >> 0xcU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0xcU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffffff7fff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0xfU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffffff0fff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0xcU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x10U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x10U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x10U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x10U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x10U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x10U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffff7ffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x13U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffff0ffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x10U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x14U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x14U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x14U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x14U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x14U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x14U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffff7fffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x17U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffff0fffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x14U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x18U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x18U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x18U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x18U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x18U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x18U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffff7ffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x1bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffff0ffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x18U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x1cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x1cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x1cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x1cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x1cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x1cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffff7fffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x1fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffff0fffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x1cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x20U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x20U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x20U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x20U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x20U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x20U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffff7ffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x23U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffff0ffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x20U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x24U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x24U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x24U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x24U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x24U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x24U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffff7fffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x27U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffff0fffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x24U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x28U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x28U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x28U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x28U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x28U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x28U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffff7ffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x2bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffff0ffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x28U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x2cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x2cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x2cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x2cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x2cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x2cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffff7fffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x2fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffff0fffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x2cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x30U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x30U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x30U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x30U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x30U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x30U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfff7ffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x33U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfff0ffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x30U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x34U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x34U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x34U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x34U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x34U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x34U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xff7fffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x37U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xff0fffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x34U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x38U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x38U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x38U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x38U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x38U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x38U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xf7ffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x3bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xf0ffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x38U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x3cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x3cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x3cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x3cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x3cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x3cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0x7fffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x3fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x3cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
           << 1U);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
           >> 1U);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
           << 1U);
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
            = vlTOPp->testbench__DOT__uut__DOT__reg_op2;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
                = ((0xffff0000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                   << 0x10U)) | (0xffffU 
                                                 & vlTOPp->testbench__DOT__uut__DOT__reg_op2));
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
                    = ((0xff000000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                       << 0x18U)) | 
                       ((0xff0000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                      << 0x10U)) | 
                        ((0xff00U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                     << 8U)) | (0xffU 
                                                & vlTOPp->testbench__DOT__uut__DOT__reg_op2))));
            }
        }
    }
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb = 0xfU;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb 
                = ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                    ? 0xcU : 3U);
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb 
                    = (0xfU & ((IData)(1U) << (3U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)));
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__alu_eq = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                == vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    vlTOPp->testbench__DOT__uut__DOT__alu_lts = VL_LTS_III(1,32,32, vlTOPp->testbench__DOT__uut__DOT__reg_op1, vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    vlTOPp->testbench__DOT__uut__DOT__alu_ltu = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                 < vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_imm 
            = (0x13U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu 
            = (3U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__is_sb_sh_sw 
            = (0x23U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j 
            = ((0xfffffU & vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j) 
               | (0xfff00000U & VL_EXTENDS_II(32,21, 
                                              (0x1ffffeU 
                                               & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                                                  >> 0xbU)))));
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j 
            = ((0xfffff801U & vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j) 
               | (0x7feU & (VL_EXTENDS_II(32,21, (0x1ffffeU 
                                                  & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                                                     >> 0xbU))) 
                            >> 9U)));
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j 
            = ((0xfffff7ffU & vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j) 
               | (0x800U & (VL_EXTENDS_II(32,21, (0x1ffffeU 
                                                  & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                                                     >> 0xbU))) 
                            << 2U)));
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j 
            = ((0xfff00fffU & vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j) 
               | (0xff000U & (VL_EXTENDS_II(32,21, 
                                            (0x1ffffeU 
                                             & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                                                >> 0xbU))) 
                              << 0xbU)));
        vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j 
            = ((0xfffffffeU & vlTOPp->testbench__DOT__uut__DOT__decoded_imm_j) 
               | (1U & VL_EXTENDS_II(1,21, (0x1ffffeU 
                                            & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                                               >> 0xbU)))));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_auipc 
            = (0x17U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_lui 
            = (0x37U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_jal 
            = (0x6fU == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_jalr 
            = ((0x67U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle)) 
               & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
                               >> 0xcU))));
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu 
            = (0x63U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if ((1U & (~ (IData)(vlTOPp->testbench__DOT__resetn)))) {
        vlTOPp->testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu = 0U;
    }
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_trigger) 
         & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_add 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sub 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (0U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0x20U 
                                               == (0x7fU 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sll 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_slt 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (2U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sltu 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (3U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_xor 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (4U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_srl 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_sra 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0x20U 
                                               == (0x7fU 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_or 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (6U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__instr_and 
            = (((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
                & (7U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                >> 0xcU)))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U))));
        vlTOPp->testbench__DOT__uut__DOT__is_sll_srl_sra 
            = ((IData)(vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg) 
               & (((1U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                 >> 0xcU))) & (0U == 
                                               (0x7fU 
                                                & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                   >> 0x19U)))) 
                  | (((5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                    >> 0xcU))) & (0U 
                                                  == 
                                                  (0x7fU 
                                                   & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                                      >> 0x19U)))) 
                     | ((5U == (7U & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                      >> 0xcU))) & 
                        (0x20U == (0x7fU & (vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
                                            >> 0x19U)))))));
    }
    if ((1U & (~ (IData)(vlTOPp->testbench__DOT__resetn)))) {
        vlTOPp->testbench__DOT__uut__DOT__instr_add = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_sub = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_sll = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_slt = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_sltu = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_xor = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_srl = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_sra = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_or = 0U;
        vlTOPp->testbench__DOT__uut__DOT__instr_and = 0U;
    }
    vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wait 
        = __Vdly__testbench__DOT__uut__DOT__pcpi_mul_wait;
    vlTOPp->testbench__DOT__uut__DOT__decoder_pseudo_trigger 
        = __Vdly__testbench__DOT__uut__DOT__decoder_pseudo_trigger;
    vlTOPp->testbench__DOT__uut__DOT__decoder_trigger 
        = __Vdly__testbench__DOT__uut__DOT__decoder_trigger;
    if (VL_GTS_III(1,32,32, 0x64U, vlTOPp->testbench__DOT__resetn_cnt)) {
        vlTOPp->testbench__DOT__resetn_cnt = ((IData)(1U) 
                                              + vlTOPp->testbench__DOT__resetn_cnt);
    } else {
        vlTOPp->testbench__DOT__resetn = 1U;
    }
    vlTOPp->testbench__DOT__uut__DOT__alu_out_0 = 0U;
    vlTOPp->testbench__DOT__uut__DOT__alu_out = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__instr_beq) {
        vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
            = vlTOPp->testbench__DOT__uut__DOT__alu_eq;
    } else {
        if (vlTOPp->testbench__DOT__uut__DOT__instr_bne) {
            vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_eq)));
        } else {
            if (vlTOPp->testbench__DOT__uut__DOT__instr_bge) {
                vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                    = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_lts)));
            } else {
                if (vlTOPp->testbench__DOT__uut__DOT__instr_bgeu) {
                    vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                        = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_ltu)));
                } else {
                    if (vlTOPp->testbench__DOT__uut__DOT__is_slti_blt_slt) {
                        vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                            = vlTOPp->testbench__DOT__uut__DOT__alu_lts;
                    } else {
                        if (vlTOPp->testbench__DOT__uut__DOT__is_sltiu_bltu_sltu) {
                            vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                                = vlTOPp->testbench__DOT__uut__DOT__alu_ltu;
                        }
                    }
                }
            }
        }
    }
    if (vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub) {
        vlTOPp->testbench__DOT__uut__DOT__alu_out = 
            ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sub)
              ? (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                 - vlTOPp->testbench__DOT__uut__DOT__reg_op2)
              : (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                 + vlTOPp->testbench__DOT__uut__DOT__reg_op2));
    } else {
        if (vlTOPp->testbench__DOT__uut__DOT__is_compare) {
            vlTOPp->testbench__DOT__uut__DOT__alu_out 
                = vlTOPp->testbench__DOT__uut__DOT__alu_out_0;
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xori) 
                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xor))) {
                vlTOPp->testbench__DOT__uut__DOT__alu_out 
                    = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                       ^ vlTOPp->testbench__DOT__uut__DOT__reg_op2);
            } else {
                if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_ori) 
                     | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_or))) {
                    vlTOPp->testbench__DOT__uut__DOT__alu_out 
                        = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                           | vlTOPp->testbench__DOT__uut__DOT__reg_op2);
                } else {
                    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_andi) 
                         | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_and))) {
                        vlTOPp->testbench__DOT__uut__DOT__alu_out 
                            = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                               & vlTOPp->testbench__DOT__uut__DOT__reg_op2);
                    }
                }
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__instr_trap = 
        (1U & (~ (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui) 
                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_auipc) 
                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jal) 
                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr) 
                            | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_beq) 
                               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bne) 
                                  | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_blt) 
                                     | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bge) 
                                        | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bltu) 
                                           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bgeu) 
                                              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lb) 
                                                 | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lh) 
                                                    | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lw) 
                                                       | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lbu) 
                                                          | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lhu) 
                                                             | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sb) 
                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sh) 
                                                                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sw) 
                                                                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_addi) 
                                                                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slti) 
                                                                            | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltiu) 
                                                                               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xori) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_ori) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_andi) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slli) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srli) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srai) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_add) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sub) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sll) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slt) 
                                                                                | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltu)))))))))))))))))))))))))))))))) 
                  | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xor) 
                     | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srl) 
                        | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sra) 
                           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_or) 
                              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_and) 
                                 | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdcycle) 
                                    | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdcycleh) 
                                       | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdinstr) 
                                          | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdinstrh) 
                                             | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_getq) 
                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_setq) 
                                                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_retirq) 
                                                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_maskirq) 
                                                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_waitirq) 
                                                            | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_timer))))))))))))))))));
    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
         & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_done))) {
        vlTOPp->testbench__DOT__uut__DOT__is_alu_reg_reg 
            = (0x33U == (0x7fU & vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle));
    }
    if (vlTOPp->testbench__DOT__uut__DOT__mem_xfer) {
        vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q 
            = vlTOPp->testbench__DOT__mem_rdata;
    }
    vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst 
        = __Vdly__testbench__DOT__uut__DOT__mem_do_rinst;
    vlTOPp->testbench__DOT__uut__DOT__mem_xfer = ((IData)(vlTOPp->testbench__DOT__mem_valid) 
                                                  & (IData)(vlTOPp->testbench__DOT__mem_ready));
    vlTOPp->testbench__DOT__mem_rdata = ((0xffffff00U 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | vlTOPp->testbench__DOT__memory
                                         [(0x1ffU & vlTOPp->testbench__DOT__mem_addr)]);
    vlTOPp->testbench__DOT__mem_rdata = ((0xffff00ffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(1U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 8U));
    vlTOPp->testbench__DOT__mem_rdata = ((0xff00ffffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(2U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 0x10U));
    vlTOPp->testbench__DOT__mem_rdata = ((0xffffffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(3U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 0x18U));
    vlTOPp->testbench__DOT__uut__DOT__mem_la_write 
        = (((IData)(vlTOPp->testbench__DOT__resetn) 
            & (~ (IData)((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))))) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata));
    vlTOPp->testbench__DOT__uut__DOT__mem_la_read = 
        ((IData)(vlTOPp->testbench__DOT__resetn) & 
         ((~ (IData)((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state)))) 
          & (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
             | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata))));
    vlTOPp->testbench__DOT__uut__DOT__mem_done = ((IData)(vlTOPp->testbench__DOT__resetn) 
                                                  & ((((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_xfer) 
                                                       & (0U 
                                                          != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) 
                                                      & (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
                                                          | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata)) 
                                                         | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata))) 
                                                     | ((3U 
                                                         == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state)) 
                                                        & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst))));
    vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_xfer)
            ? vlTOPp->testbench__DOT__mem_rdata : vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q);
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
            = vlTOPp->testbench__DOT__mem_rdata;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            if ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)) {
                if ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)) {
                    vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                        = (0xffffU & (vlTOPp->testbench__DOT__mem_rdata 
                                      >> 0x10U));
                }
            } else {
                vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                    = (0xffffU & vlTOPp->testbench__DOT__mem_rdata);
            }
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                    = ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                        ? ((1U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                            ? (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                        >> 0x18U)) : 
                           (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                     >> 0x10U))) : 
                       ((1U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                         ? (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                     >> 8U)) : (0xffU 
                                                & vlTOPp->testbench__DOT__mem_rdata)));
            }
        }
    }
}

void Vtestbench::_initial__TOP__2(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_initial__TOP__2\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    VL_READMEM_N(true, 8, 512, 0, VL_CVT_PACK_STR_NW(26, vlTOPp->hex_file_name)
                 , vlTOPp->testbench__DOT__memory, 0
                 , ~VL_ULL(0));
    vlTOPp->testbench__DOT__x32 = 0x12b9b0a1U;
    vlTOPp->testbench__DOT__resetn = 0U;
    vlTOPp->testbench__DOT__resetn_cnt = 0U;
}

void Vtestbench::_settle__TOP__3(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_settle__TOP__3\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs1 = 
        ((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__decoded_rs1))
          ? vlTOPp->testbench__DOT__uut__DOT__cpuregs
         [vlTOPp->testbench__DOT__uut__DOT__decoded_rs1]
          : 0U);
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 0U;
    if ((0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
        if (vlTOPp->testbench__DOT__uut__DOT__latched_branch) {
            vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 1U;
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch)))) {
                vlTOPp->testbench__DOT__uut__DOT__cpuregs_write = 1U;
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__next_pc = (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                                                  & (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch))
                                                  ? 
                                                 (0xfffffffeU 
                                                  & vlTOPp->testbench__DOT__uut__DOT__reg_out)
                                                  : vlTOPp->testbench__DOT__uut__DOT__reg_next_pc);
    vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_int_wr 
            = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_wr;
    }
    vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_ready) {
        vlTOPp->testbench__DOT__uut__DOT__pcpi_int_rd 
            = vlTOPp->testbench__DOT__uut__DOT__pcpi_mul_rd;
    }
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_rs2 = 
        ((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__decoded_rs2))
          ? vlTOPp->testbench__DOT__uut__DOT__cpuregs
         [vlTOPp->testbench__DOT__uut__DOT__decoded_rs2]
          : 0U);
    vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata = 0U;
    if ((0x40U == (IData)(vlTOPp->testbench__DOT__uut__DOT__cpu_state))) {
        if (vlTOPp->testbench__DOT__uut__DOT__latched_branch) {
            vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata 
                = (vlTOPp->testbench__DOT__uut__DOT__reg_pc 
                   + ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_compr)
                       ? 2U : 4U));
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_store) 
                 & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__latched_branch)))) {
                vlTOPp->testbench__DOT__uut__DOT__cpuregs_wrdata 
                    = ((IData)(vlTOPp->testbench__DOT__uut__DOT__latched_stalu)
                        ? vlTOPp->testbench__DOT__uut__DOT__alu_out_q
                        : vlTOPp->testbench__DOT__uut__DOT__reg_out);
            }
        }
    }
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb = 0xfU;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb 
                = ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                    ? 0xcU : 3U);
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_la_wstrb 
                    = (0xfU & ((IData)(1U) << (3U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)));
            }
        }
    }
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
            = vlTOPp->testbench__DOT__uut__DOT__reg_op2;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
                = ((0xffff0000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                   << 0x10U)) | (0xffffU 
                                                 & vlTOPp->testbench__DOT__uut__DOT__reg_op2));
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_la_wdata 
                    = ((0xff000000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                       << 0x18U)) | 
                       ((0xff0000U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                      << 0x10U)) | 
                        ((0xff00U & (vlTOPp->testbench__DOT__uut__DOT__reg_op2 
                                     << 8U)) | (0xffU 
                                                & vlTOPp->testbench__DOT__uut__DOT__reg_op2))));
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh) 
           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
        = vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2;
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
        = ((1U & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1))
            ? vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2
            : VL_ULL(0));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt = VL_ULL(0);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd)) 
                   + (0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx))) 
                  + (0xfU & (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2))) 
                 >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
                    + (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx)) 
                   + (IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffffffff7) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 3U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffffff0) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | (IData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 4U))) + (0xfU 
                                                & (IData)(
                                                          (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                           >> 4U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 4U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 4U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                >> 4U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 4U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffffffff7f) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 7U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffffffff0f) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 8U))) + (0xfU 
                                                & (IData)(
                                                          (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                           >> 8U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 8U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 8U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                >> 8U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 8U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffffff7ff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0xbU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffff0ff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 8U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0xcU))) + (0xfU 
                                                  & (IData)(
                                                            (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                             >> 0xcU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0xcU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0xcU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                  >> 0xcU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0xcU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffffff7fff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0xfU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffffff0fff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0xcU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x10U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x10U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x10U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x10U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x10U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x10U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffffff7ffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x13U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffff0ffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x10U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x14U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x14U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x14U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x14U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x14U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x14U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffffff7fffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x17U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffffff0fffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x14U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x18U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x18U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x18U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x18U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x18U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x18U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffffff7ffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x1bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffff0ffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x18U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x1cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x1cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x1cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x1cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x1cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x1cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffffff7fffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x1fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffffff0fffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x1cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x20U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x20U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x20U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x20U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x20U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x20U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffffff7ffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x23U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffff0ffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x20U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x24U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x24U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x24U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x24U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x24U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x24U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffffff7fffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x27U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffffff0fffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x24U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x28U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x28U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x28U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x28U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x28U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x28U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfffff7ffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x2bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffff0ffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x28U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x2cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x2cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x2cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x2cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x2cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x2cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xffff7fffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x2fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xffff0fffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x2cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x30U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x30U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x30U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x30U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x30U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x30U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xfff7ffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x33U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfff0ffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x30U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x34U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x34U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x34U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x34U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x34U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x34U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xff7fffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x37U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xff0fffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x34U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x38U))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x38U)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x38U)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x38U)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x38U))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x38U))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0xf7ffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x3bU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xf0ffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x38U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 
        = (1U & ((((0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                                    >> 0x3cU))) + (0xfU 
                                                   & (IData)(
                                                             (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                              >> 0x3cU)))) 
                  + (0xfU & (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                                     >> 0x3cU)))) >> 4U));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 
        = (0xfU & (((IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
                             >> 0x3cU)) + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
                                                   >> 0x3cU))) 
                   + (IData)((vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 
                              >> 0x3cU))));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
        = ((VL_ULL(0x7fffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1)) 
              << 0x3fU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd 
        = ((VL_ULL(0xfffffffffffffff) & vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd) 
           | ((QData)((IData)(vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2)) 
              << 0x3cU));
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt 
           << 1U);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 
           >> 1U);
    vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
        = (vlTOPp->testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 
           << 1U);
    vlTOPp->testbench__DOT__uut__DOT__alu_eq = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                == vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    vlTOPp->testbench__DOT__uut__DOT__alu_lts = VL_LTS_III(1,32,32, vlTOPp->testbench__DOT__uut__DOT__reg_op1, vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    vlTOPp->testbench__DOT__uut__DOT__alu_ltu = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                                                 < vlTOPp->testbench__DOT__uut__DOT__reg_op2);
    vlTOPp->testbench__DOT__uut__DOT__instr_trap = 
        (1U & (~ (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lui) 
                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_auipc) 
                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jal) 
                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_jalr) 
                            | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_beq) 
                               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bne) 
                                  | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_blt) 
                                     | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bge) 
                                        | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bltu) 
                                           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_bgeu) 
                                              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lb) 
                                                 | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lh) 
                                                    | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lw) 
                                                       | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lbu) 
                                                          | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_lhu) 
                                                             | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sb) 
                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sh) 
                                                                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sw) 
                                                                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_addi) 
                                                                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slti) 
                                                                            | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltiu) 
                                                                               | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xori) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_ori) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_andi) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slli) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srli) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srai) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_add) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sub) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sll) 
                                                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_slt) 
                                                                                | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sltu)))))))))))))))))))))))))))))))) 
                  | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xor) 
                     | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_srl) 
                        | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sra) 
                           | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_or) 
                              | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_and) 
                                 | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdcycle) 
                                    | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdcycleh) 
                                       | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdinstr) 
                                          | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_rdinstrh) 
                                             | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_getq) 
                                                | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_setq) 
                                                   | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_retirq) 
                                                      | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_maskirq) 
                                                         | ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_waitirq) 
                                                            | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_timer))))))))))))))))));
    vlTOPp->testbench__DOT__mem_rdata = ((0xffffff00U 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | vlTOPp->testbench__DOT__memory
                                         [(0x1ffU & vlTOPp->testbench__DOT__mem_addr)]);
    vlTOPp->testbench__DOT__mem_rdata = ((0xffff00ffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(1U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 8U));
    vlTOPp->testbench__DOT__mem_rdata = ((0xff00ffffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(2U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 0x10U));
    vlTOPp->testbench__DOT__mem_rdata = ((0xffffffU 
                                          & vlTOPp->testbench__DOT__mem_rdata) 
                                         | (vlTOPp->testbench__DOT__memory
                                            [(0x1ffU 
                                              & ((IData)(3U) 
                                                 + vlTOPp->testbench__DOT__mem_addr))] 
                                            << 0x18U));
    vlTOPp->testbench__DOT__mem_ready = (vlTOPp->testbench__DOT__x32 
                                         & (IData)(vlTOPp->testbench__DOT__mem_valid));
    vlTOPp->testbench__DOT__uut__DOT__mem_la_write 
        = (((IData)(vlTOPp->testbench__DOT__resetn) 
            & (~ (IData)((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))))) 
           & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata));
    vlTOPp->testbench__DOT__uut__DOT__mem_la_read = 
        ((IData)(vlTOPp->testbench__DOT__resetn) & 
         ((~ (IData)((0U != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state)))) 
          & (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
              | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_prefetch)) 
             | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata))));
    vlTOPp->testbench__DOT__uut__DOT__alu_out_0 = 0U;
    vlTOPp->testbench__DOT__uut__DOT__alu_out = 0U;
    if (vlTOPp->testbench__DOT__uut__DOT__instr_beq) {
        vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
            = vlTOPp->testbench__DOT__uut__DOT__alu_eq;
    } else {
        if (vlTOPp->testbench__DOT__uut__DOT__instr_bne) {
            vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_eq)));
        } else {
            if (vlTOPp->testbench__DOT__uut__DOT__instr_bge) {
                vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                    = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_lts)));
            } else {
                if (vlTOPp->testbench__DOT__uut__DOT__instr_bgeu) {
                    vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                        = (1U & (~ (IData)(vlTOPp->testbench__DOT__uut__DOT__alu_ltu)));
                } else {
                    if (vlTOPp->testbench__DOT__uut__DOT__is_slti_blt_slt) {
                        vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                            = vlTOPp->testbench__DOT__uut__DOT__alu_lts;
                    } else {
                        if (vlTOPp->testbench__DOT__uut__DOT__is_sltiu_bltu_sltu) {
                            vlTOPp->testbench__DOT__uut__DOT__alu_out_0 
                                = vlTOPp->testbench__DOT__uut__DOT__alu_ltu;
                        }
                    }
                }
            }
        }
    }
    if (vlTOPp->testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub) {
        vlTOPp->testbench__DOT__uut__DOT__alu_out = 
            ((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_sub)
              ? (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                 - vlTOPp->testbench__DOT__uut__DOT__reg_op2)
              : (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                 + vlTOPp->testbench__DOT__uut__DOT__reg_op2));
    } else {
        if (vlTOPp->testbench__DOT__uut__DOT__is_compare) {
            vlTOPp->testbench__DOT__uut__DOT__alu_out 
                = vlTOPp->testbench__DOT__uut__DOT__alu_out_0;
        } else {
            if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xori) 
                 | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_xor))) {
                vlTOPp->testbench__DOT__uut__DOT__alu_out 
                    = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                       ^ vlTOPp->testbench__DOT__uut__DOT__reg_op2);
            } else {
                if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_ori) 
                     | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_or))) {
                    vlTOPp->testbench__DOT__uut__DOT__alu_out 
                        = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                           | vlTOPp->testbench__DOT__uut__DOT__reg_op2);
                } else {
                    if (((IData)(vlTOPp->testbench__DOT__uut__DOT__instr_andi) 
                         | (IData)(vlTOPp->testbench__DOT__uut__DOT__instr_and))) {
                        vlTOPp->testbench__DOT__uut__DOT__alu_out 
                            = (vlTOPp->testbench__DOT__uut__DOT__reg_op1 
                               & vlTOPp->testbench__DOT__uut__DOT__reg_op2);
                    }
                }
            }
        }
    }
    if ((0U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
        vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
            = vlTOPp->testbench__DOT__mem_rdata;
    } else {
        if ((1U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
            if ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)) {
                if ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)) {
                    vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                        = (0xffffU & (vlTOPp->testbench__DOT__mem_rdata 
                                      >> 0x10U));
                }
            } else {
                vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                    = (0xffffU & vlTOPp->testbench__DOT__mem_rdata);
            }
        } else {
            if ((2U == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_wordsize))) {
                vlTOPp->testbench__DOT__uut__DOT__mem_rdata_word 
                    = ((2U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                        ? ((1U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                            ? (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                        >> 0x18U)) : 
                           (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                     >> 0x10U))) : 
                       ((1U & vlTOPp->testbench__DOT__uut__DOT__reg_op1)
                         ? (0xffU & (vlTOPp->testbench__DOT__mem_rdata 
                                     >> 8U)) : (0xffU 
                                                & vlTOPp->testbench__DOT__mem_rdata)));
            }
        }
    }
    vlTOPp->testbench__DOT__uut__DOT__mem_xfer = ((IData)(vlTOPp->testbench__DOT__mem_valid) 
                                                  & (IData)(vlTOPp->testbench__DOT__mem_ready));
    vlTOPp->testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle 
        = ((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_xfer)
            ? vlTOPp->testbench__DOT__mem_rdata : vlTOPp->testbench__DOT__uut__DOT__mem_rdata_q);
    vlTOPp->testbench__DOT__uut__DOT__mem_done = ((IData)(vlTOPp->testbench__DOT__resetn) 
                                                  & ((((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_xfer) 
                                                       & (0U 
                                                          != (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state))) 
                                                      & (((IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst) 
                                                          | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rdata)) 
                                                         | (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_wdata))) 
                                                     | ((3U 
                                                         == (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_state)) 
                                                        & (IData)(vlTOPp->testbench__DOT__uut__DOT__mem_do_rinst))));
}

void Vtestbench::_eval(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_eval\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    if (((IData)(vlTOPp->clk) & (~ (IData)(vlTOPp->__Vclklast__TOP__clk)))) {
        vlTOPp->_sequent__TOP__1(vlSymsp);
    }
    // Final
    vlTOPp->__Vclklast__TOP__clk = vlTOPp->clk;
}

void Vtestbench::_eval_initial(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_eval_initial\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    vlTOPp->__Vclklast__TOP__clk = vlTOPp->clk;
    vlTOPp->_initial__TOP__2(vlSymsp);
}

void Vtestbench::final() {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::final\n"); );
    // Variables
    Vtestbench__Syms* __restrict vlSymsp = this->__VlSymsp;
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
}

void Vtestbench::_eval_settle(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_eval_settle\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    vlTOPp->_settle__TOP__3(vlSymsp);
}

VL_INLINE_OPT QData Vtestbench::_change_request(Vtestbench__Syms* __restrict vlSymsp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_change_request\n"); );
    Vtestbench* __restrict vlTOPp VL_ATTR_UNUSED = vlSymsp->TOPp;
    // Body
    // Change detection
    QData __req = false;  // Logically a bool
    return __req;
}

#ifdef VL_DEBUG
void Vtestbench::_eval_debug_assertions() {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_eval_debug_assertions\n"); );
    // Body
    if (VL_UNLIKELY((clk & 0xfeU))) {
        Verilated::overWidthError("clk");}
    if (VL_UNLIKELY((hex_file_name[0x19U] & 0xfffffffeU))) {
        Verilated::overWidthError("hex_file_name");}
}
#endif  // VL_DEBUG

void Vtestbench::_ctor_var_reset() {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtestbench::_ctor_var_reset\n"); );
    // Body
    clk = VL_RAND_RESET_I(1);
    VL_RAND_RESET_W(801, hex_file_name);
    testbench__DOT__resetn = VL_RAND_RESET_I(1);
    testbench__DOT__resetn_cnt = VL_RAND_RESET_I(32);
    testbench__DOT__trap = VL_RAND_RESET_I(1);
    testbench__DOT__mem_valid = VL_RAND_RESET_I(1);
    testbench__DOT__mem_ready = VL_RAND_RESET_I(1);
    testbench__DOT__mem_addr = VL_RAND_RESET_I(32);
    testbench__DOT__mem_wdata = VL_RAND_RESET_I(32);
    testbench__DOT__mem_wstrb = VL_RAND_RESET_I(4);
    testbench__DOT__mem_rdata = VL_RAND_RESET_I(32);
    testbench__DOT__x32 = VL_RAND_RESET_I(32);
    testbench__DOT__next_x32 = VL_RAND_RESET_I(32);
    { int __Vi0=0; for (; __Vi0<512; ++__Vi0) {
            testbench__DOT__memory[__Vi0] = VL_RAND_RESET_I(8);
    }}
    testbench__DOT__uut__DOT__mem_la_read = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_la_write = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_la_wdata = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__mem_la_wstrb = VL_RAND_RESET_I(4);
    testbench__DOT__uut__DOT__pcpi_valid = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__pcpi_insn = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_pc = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_next_pc = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_op1 = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_op2 = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_out = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__reg_sh = VL_RAND_RESET_I(5);
    testbench__DOT__uut__DOT__next_pc = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__timer = VL_RAND_RESET_I(32);
    { int __Vi0=0; for (; __Vi0<32; ++__Vi0) {
            testbench__DOT__uut__DOT__cpuregs[__Vi0] = VL_RAND_RESET_I(32);
    }}
    testbench__DOT__uut__DOT__pcpi_mul_wr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__pcpi_mul_rd = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__pcpi_mul_wait = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__pcpi_mul_ready = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__pcpi_int_wr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__pcpi_int_rd = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__mem_state = VL_RAND_RESET_I(2);
    testbench__DOT__uut__DOT__mem_wordsize = VL_RAND_RESET_I(2);
    testbench__DOT__uut__DOT__mem_rdata_word = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__mem_rdata_q = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__mem_do_prefetch = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_do_rinst = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_do_rdata = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_do_wdata = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_xfer = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__mem_done = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lui = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_auipc = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_jal = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_jalr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_beq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_bne = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_blt = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_bge = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_bltu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_bgeu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lb = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lw = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lbu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_lhu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sb = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sw = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_addi = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_slti = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sltiu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_xori = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_ori = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_andi = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_slli = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_srli = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_srai = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_add = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sub = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sll = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_slt = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sltu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_xor = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_srl = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_sra = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_or = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_and = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_rdcycle = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_rdcycleh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_rdinstr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_rdinstrh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_ecall_ebreak = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_getq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_setq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_retirq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_maskirq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_waitirq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_timer = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__instr_trap = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__decoded_rd = VL_RAND_RESET_I(5);
    testbench__DOT__uut__DOT__decoded_rs1 = VL_RAND_RESET_I(5);
    testbench__DOT__uut__DOT__decoded_rs2 = VL_RAND_RESET_I(5);
    testbench__DOT__uut__DOT__decoded_imm = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__decoded_imm_j = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__decoder_trigger = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__decoder_trigger_q = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__decoder_pseudo_trigger = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__decoder_pseudo_trigger_q = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__compressed_instr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_lui_auipc_jal = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_slli_srli_srai = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_jalr_addi_slti_sltiu_xori_ori_andi = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_sb_sh_sw = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_sll_srl_sra = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_slti_blt_slt = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_sltiu_bltu_sltu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_lbu_lhu_lw = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_alu_reg_imm = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_alu_reg_reg = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__is_compare = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__cpu_state = VL_RAND_RESET_I(8);
    testbench__DOT__uut__DOT__set_mem_do_rinst = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__set_mem_do_rdata = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__set_mem_do_wdata = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_store = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_stalu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_branch = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_compr = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_is_lu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_is_lh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_is_lb = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__latched_rd = VL_RAND_RESET_I(5);
    testbench__DOT__uut__DOT__current_pc = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__do_waitirq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__alu_out = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__alu_out_q = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__alu_out_0 = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__alu_eq = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__alu_ltu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__alu_lts = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__cpuregs_write = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__cpuregs_wrdata = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__cpuregs_rs1 = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__cpuregs_rs2 = VL_RAND_RESET_I(32);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mul = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__pcpi_wait_q = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1 = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2 = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1 = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2 = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2 = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt = VL_RAND_RESET_Q(64);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter = VL_RAND_RESET_I(7);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1 = VL_RAND_RESET_I(1);
    testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2 = VL_RAND_RESET_I(4);
}
