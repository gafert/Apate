import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Bindings } from '../../../core/services/sim-lib-interface/bindings';
import 'assets/alu.svg';
import * as d3 from 'd3';
import { byteToHex } from '../../../globals';

@Component({
	selector: 'app-alu',
	templateUrl: './alu.component.html',
	styleUrls: ['./alu.component.css'],
})
export class AluComponent implements OnChanges {
	@Input() public bindings: Bindings;

	@Input() public reg_op1 = 0;
	@Input() public reg_op2 = 0;
	@Input() public alu_out = 0;

	@Input() public decoded_rs1 = 0; // CPU Reg address where the data comes from
	@Input() public decoded_rs2 = 0; // CPU Reg address where the data comes from
	@Input() public decoded_rd = 0; // CPU Reg address where the data goes to

	@Input() public cpuregs_rs1 = 0; // Value from the register
	@Input() public cpuregs_rs2 = 0; // Value from the register
	@Input() public decoded_imm = 0;

	@Input() public instr_addi = 0;

	private aluImageLoaded;

	constructor() {}

	ngOnChanges(simpleChanges: SimpleChanges): void {
		if (this.aluImageLoaded) {
			this.getAluSelection().select('#reg_op1').select('tspan').text(byteToHex(this.reg_op1, 8));
			this.getAluSelection().select('#reg_op2').select('tspan').text(byteToHex(this.reg_op2, 8));
			this.getAluSelection().select('#alu_out').select('tspan').text(byteToHex(this.alu_out, 8));
			this.getAluSelection().select('#decoded_rs1').select('tspan').text(byteToHex(this.decoded_rs1, 8));
			this.getAluSelection().select('#decoded_rs2').select('tspan').text(byteToHex(this.decoded_rs2, 8));
			this.getAluSelection().select('#decoded_rd').select('tspan').text(byteToHex(this.decoded_rd, 8));
			this.getAluSelection().select('#cpuregs_rs1').select('tspan').text(byteToHex(this.cpuregs_rs1, 8));
			this.getAluSelection().select('#cpuregs_rs2').select('tspan').text(byteToHex(this.cpuregs_rs2, 8));
			this.getAluSelection().select('#decoded_imm').select('tspan').text(byteToHex(this.decoded_imm, 8));
			if (this.instr_addi) {
				//  this.getAluSelection().select('#instr_addi').select('tspan').style("font-size", "34px")
			}
		}
	}

	aluLoaded(event) {
		this.aluImageLoaded = true;
	}

	getAluSelection() {
		return d3.select((d3.select('#alu').node() as HTMLObjectElement).getSVGDocument());
	}
}
