// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Primary design header
//
// This header should be included by all source files instantiating the design.
// The class here is then constructed to instantiate the design.
// See the Verilator manual for examples.

#ifndef _VTESTBENCH_H_
#define _VTESTBENCH_H_  // guard

#include "verilated_heavy.h"
#include "Vtestbench__Dpi.h"

//==========

class Vtestbench__Syms;
class Vtestbench___024unit;


//----------

VL_MODULE(Vtestbench) {
  public:
    // CELLS
    // Public to allow access to /*verilator_public*/ items;
    // otherwise the application code can consider these internals.
    Vtestbench___024unit* __PVT____024unit;
    
    // PORTS
    // The application code writes and reads these signals to
    // propagate new values into/out from the Verilated model.
    VL_IN8(clk,0,0);
    VL_INW(hex_file_name,800,0,26);
    
    // LOCAL SIGNALS
    // Internals; generally not touched by application code
    // Anonymous structures to workaround compiler member-count bugs
    struct {
        CData/*0:0*/ testbench__DOT__resetn;
        CData/*0:0*/ testbench__DOT__trap;
        CData/*0:0*/ testbench__DOT__mem_valid;
        CData/*0:0*/ testbench__DOT__mem_ready;
        CData/*3:0*/ testbench__DOT__mem_wstrb;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_la_read;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_la_write;
        CData/*3:0*/ testbench__DOT__uut__DOT__mem_la_wstrb;
        CData/*0:0*/ testbench__DOT__uut__DOT__pcpi_valid;
        CData/*4:0*/ testbench__DOT__uut__DOT__reg_sh;
        CData/*0:0*/ testbench__DOT__uut__DOT__pcpi_mul_wr;
        CData/*0:0*/ testbench__DOT__uut__DOT__pcpi_mul_wait;
        CData/*0:0*/ testbench__DOT__uut__DOT__pcpi_mul_ready;
        CData/*0:0*/ testbench__DOT__uut__DOT__pcpi_int_wr;
        CData/*1:0*/ testbench__DOT__uut__DOT__mem_state;
        CData/*1:0*/ testbench__DOT__uut__DOT__mem_wordsize;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_do_prefetch;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_do_rinst;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_do_rdata;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_do_wdata;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_xfer;
        CData/*0:0*/ testbench__DOT__uut__DOT__mem_done;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lui;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_auipc;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_jal;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_jalr;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_beq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_bne;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_blt;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_bge;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_bltu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_bgeu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lb;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lh;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lw;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lbu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_lhu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sb;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sh;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sw;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_addi;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_slti;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sltiu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_xori;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_ori;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_andi;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_slli;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_srli;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_srai;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_add;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sub;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sll;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_slt;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sltu;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_xor;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_srl;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_sra;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_or;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_and;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_rdcycle;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_rdcycleh;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_rdinstr;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_rdinstrh;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_ecall_ebreak;
    };
    struct {
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_getq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_setq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_retirq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_maskirq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_waitirq;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_timer;
        CData/*0:0*/ testbench__DOT__uut__DOT__instr_trap;
        CData/*4:0*/ testbench__DOT__uut__DOT__decoded_rd;
        CData/*4:0*/ testbench__DOT__uut__DOT__decoded_rs1;
        CData/*4:0*/ testbench__DOT__uut__DOT__decoded_rs2;
        CData/*0:0*/ testbench__DOT__uut__DOT__decoder_trigger;
        CData/*0:0*/ testbench__DOT__uut__DOT__decoder_trigger_q;
        CData/*0:0*/ testbench__DOT__uut__DOT__decoder_pseudo_trigger;
        CData/*0:0*/ testbench__DOT__uut__DOT__decoder_pseudo_trigger_q;
        CData/*0:0*/ testbench__DOT__uut__DOT__compressed_instr;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_lui_auipc_jal;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_lb_lh_lw_lbu_lhu;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_slli_srli_srai;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_jalr_addi_slti_sltiu_xori_ori_andi;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_sb_sh_sw;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_sll_srl_sra;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_lui_auipc_jal_jalr_addi_add_sub;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_slti_blt_slt;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_sltiu_bltu_sltu;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_beq_bne_blt_bge_bltu_bgeu;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_lbu_lhu_lw;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_alu_reg_imm;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_alu_reg_reg;
        CData/*0:0*/ testbench__DOT__uut__DOT__is_compare;
        CData/*7:0*/ testbench__DOT__uut__DOT__cpu_state;
        CData/*0:0*/ testbench__DOT__uut__DOT__set_mem_do_rinst;
        CData/*0:0*/ testbench__DOT__uut__DOT__set_mem_do_rdata;
        CData/*0:0*/ testbench__DOT__uut__DOT__set_mem_do_wdata;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_store;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_stalu;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_branch;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_compr;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_is_lu;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_is_lh;
        CData/*0:0*/ testbench__DOT__uut__DOT__latched_is_lb;
        CData/*4:0*/ testbench__DOT__uut__DOT__latched_rd;
        CData/*0:0*/ testbench__DOT__uut__DOT__do_waitirq;
        CData/*0:0*/ testbench__DOT__uut__DOT__alu_out_0;
        CData/*0:0*/ testbench__DOT__uut__DOT__alu_eq;
        CData/*0:0*/ testbench__DOT__uut__DOT__alu_ltu;
        CData/*0:0*/ testbench__DOT__uut__DOT__alu_lts;
        CData/*0:0*/ testbench__DOT__uut__DOT__cpuregs_write;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mul;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulh;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhsu;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_mulhu;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__instr_any_mulh;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__pcpi_wait_q;
        CData/*6:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_counter;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_waiting;
        CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__mul_finish;
        IData/*31:0*/ testbench__DOT__resetn_cnt;
        IData/*31:0*/ testbench__DOT__mem_addr;
        IData/*31:0*/ testbench__DOT__mem_wdata;
        IData/*31:0*/ testbench__DOT__mem_rdata;
        IData/*31:0*/ testbench__DOT__x32;
        IData/*31:0*/ testbench__DOT__next_x32;
        IData/*31:0*/ testbench__DOT__uut__DOT__mem_la_wdata;
        IData/*31:0*/ testbench__DOT__uut__DOT__pcpi_insn;
    };
    struct {
        IData/*31:0*/ testbench__DOT__uut__DOT__reg_pc;
        IData/*31:0*/ testbench__DOT__uut__DOT__reg_next_pc;
        IData/*31:0*/ testbench__DOT__uut__DOT__reg_op1;
        IData/*31:0*/ testbench__DOT__uut__DOT__reg_op2;
        IData/*31:0*/ testbench__DOT__uut__DOT__reg_out;
        IData/*31:0*/ testbench__DOT__uut__DOT__next_pc;
        IData/*31:0*/ testbench__DOT__uut__DOT__timer;
        IData/*31:0*/ testbench__DOT__uut__DOT__pcpi_mul_rd;
        IData/*31:0*/ testbench__DOT__uut__DOT__pcpi_int_rd;
        IData/*31:0*/ testbench__DOT__uut__DOT__mem_rdata_word;
        IData/*31:0*/ testbench__DOT__uut__DOT__mem_rdata_q;
        IData/*31:0*/ testbench__DOT__uut__DOT__mem_rdata_latched_noshuffle;
        IData/*31:0*/ testbench__DOT__uut__DOT__decoded_imm;
        IData/*31:0*/ testbench__DOT__uut__DOT__decoded_imm_j;
        IData/*31:0*/ testbench__DOT__uut__DOT__current_pc;
        IData/*31:0*/ testbench__DOT__uut__DOT__alu_out;
        IData/*31:0*/ testbench__DOT__uut__DOT__alu_out_q;
        IData/*31:0*/ testbench__DOT__uut__DOT__cpuregs_wrdata;
        IData/*31:0*/ testbench__DOT__uut__DOT__cpuregs_rs1;
        IData/*31:0*/ testbench__DOT__uut__DOT__cpuregs_rs2;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs1;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rs2;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rd;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__rdx;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs1;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rs2;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__this_rs2;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rd;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdx;
        QData/*63:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT__next_rdt;
        CData/*7:0*/ testbench__DOT__memory[512];
        IData/*31:0*/ testbench__DOT__uut__DOT__cpuregs[32];
    };
    
    // LOCAL VARIABLES
    // Internals; generally not touched by application code
    CData/*0:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap1;
    CData/*3:0*/ testbench__DOT__uut__DOT__genblk2__DOT__pcpi_mul__DOT____Vconcswap2;
    CData/*0:0*/ __Vclklast__TOP__clk;
    
    // INTERNAL VARIABLES
    // Internals; generally not touched by application code
    Vtestbench__Syms* __VlSymsp;  // Symbol table
    
    // CONSTRUCTORS
  private:
    VL_UNCOPYABLE(Vtestbench);  ///< Copying not allowed
  public:
    /// Construct the model; called by application code
    /// The special name  may be used to make a wrapper with a
    /// single model invisible with respect to DPI scope names.
    Vtestbench(const char* name = "TOP");
    /// Destroy the model; called (often implicitly) by application code
    ~Vtestbench();
    
    // API METHODS
    /// Evaluate the model.  Application must call when inputs change.
    void eval() { eval_step(); }
    /// Evaluate when calling multiple units/models per time step.
    void eval_step();
    /// Evaluate at end of a timestep for tracing, when using eval_step().
    /// Application must call after all eval() and before time changes.
    void eval_end_step() {}
    /// Simulation complete, run final blocks.  Application must call on completion.
    void final();
    
    // INTERNAL METHODS
  private:
    static void _eval_initial_loop(Vtestbench__Syms* __restrict vlSymsp);
  public:
    void __Vconfigure(Vtestbench__Syms* symsp, bool first);
  private:
    static QData _change_request(Vtestbench__Syms* __restrict vlSymsp);
    void _ctor_var_reset() VL_ATTR_COLD;
  public:
    static void _eval(Vtestbench__Syms* __restrict vlSymsp);
  private:
#ifdef VL_DEBUG
    void _eval_debug_assertions();
#endif  // VL_DEBUG
  public:
    static void _eval_initial(Vtestbench__Syms* __restrict vlSymsp) VL_ATTR_COLD;
    static void _eval_settle(Vtestbench__Syms* __restrict vlSymsp) VL_ATTR_COLD;
    static void _initial__TOP__2(Vtestbench__Syms* __restrict vlSymsp) VL_ATTR_COLD;
    static void _sequent__TOP__1(Vtestbench__Syms* __restrict vlSymsp);
    static void _settle__TOP__3(Vtestbench__Syms* __restrict vlSymsp) VL_ATTR_COLD;
} VL_ATTR_ALIGNED(VL_CACHE_LINE_BYTES);

//----------


#endif  // guard
