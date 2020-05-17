`timescale 1ns/1ps

import "DPI-C" function void buffer_write(input int character);

module testbench(
    input clk,
    input reg [100*8:0] hex_file_name
);
    reg resetn = 0;
    integer resetn_cnt = 0;
    wire trap;

    always @(posedge clk) begin
        if (resetn_cnt < 100)
            resetn_cnt <= resetn_cnt+1;
        else
            resetn <= 1;
    end

    wire mem_valid;
    wire mem_instr;
    wire mem_ready;
    wire [31:0] mem_addr;
    wire [31:0] mem_wdata;
    wire [3:0] mem_wstrb;
    wire [31:0] mem_rdata;

    reg [31:0] x32 = 314159265;
    reg [31:0] next_x32;

    always @(posedge clk) begin
        if (resetn) begin
            next_x32 = x32;
            next_x32 = next_x32 ^ (next_x32 << 13);
            next_x32 = next_x32 ^ (next_x32 >> 17);
            next_x32 = next_x32 ^ (next_x32 << 5);
            x32 <= next_x32;
        end
    end

    picorv32#() uut(
        .clk(clk),
        .resetn(resetn),
        .trap(trap),
        .mem_valid(mem_valid),
        .mem_instr(mem_instr),
        .mem_ready(mem_ready),
        .mem_addr(mem_addr),
        .mem_wdata(mem_wdata),
        .mem_wstrb(mem_wstrb),
        .mem_rdata(mem_rdata),
        .trace_valid(trace_valid),
        .trace_data(trace_data)
    );

    reg [7:0] memory [0:512-1];
    initial $readmemh(hex_file_name, memory);

    assign mem_ready = x32[0] && mem_valid;

    assign mem_rdata[7:0] = memory[mem_addr+0];
    assign mem_rdata[15:8] = memory[mem_addr+1];
    assign mem_rdata[23:16] = memory[mem_addr+2];
    assign mem_rdata[31:24] = memory[mem_addr+3];

    always @(posedge clk) begin
        if (mem_valid && mem_ready) begin
            if (mem_wstrb && mem_addr == 'h10000000) begin
                $write("%c", mem_wdata[7:0]);
                $display(mem_wdata);
                buffer_write(mem_wdata[7:0]);
            end else begin
                if (mem_wstrb[0]) memory[mem_addr+0] <= mem_wdata[7:0];
                if (mem_wstrb[1]) memory[mem_addr+1] <= mem_wdata[15:8];
                if (mem_wstrb[2]) memory[mem_addr+2] <= mem_wdata[23:16];
                if (mem_wstrb[3]) memory[mem_addr+3] <= mem_wdata[31:24];
            end
        end
    end

    // wire trace_valid;
    // wire [35:0] trace_data;
    // integer trace_file;

    initial begin
        // trace_file = $fopen("testbench.trace", "w");
        // $fclose(trace_file);
    end

    always @(posedge clk) begin
        if (resetn && trap) begin
            // repeat (10) @(posedge clk);
            // $display("TRAP");
            // $fclose(trace_file);
            $finish;
        end else begin
            // if (trace_valid)
            // trace_file = $fopen("testbench.trace", "a");
            // $fwrite(trace_file, "%x\n", trace_data);
            // $fclose(trace_file);
        end
    end
endmodule: testbench
