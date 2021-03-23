// #include "sim.h" // not needed in this example

/**
  Adds two numbers and saves the result in the memory.
**/

// start.s contents to start the CPU and set some registers
// lui sp,0x0         -> Set the stack pointer to 0
// addi sp,sp,512     -> Set the maximum available memory by setting the stack pointer to 512
// jal ra,60          -> Jump to instruction on location 60 of memory, corresponds to main
// ecall              -> End of program

int main(void) {
  int number1 = 15; // LI = Will be loaded immediately
  // Compiled to:
  // addi a5,zero,15  -> Load 15 into register 15 (a5)
  // sw a5,-20(s0)    -> Store register a5 into memory, memory address -20(s0) is now known as variable number1

  int number2 = 763;
  // Compiled to:
  // addi a5,zero,763  -> Load 15 into register 15 (a5)
  // sw a5,-24(s0)     -> Store register a5 into memory, memory address -24(s0) is now known as variable number2

  int result = number1 + number2;
  // Compiled to:
  // lw a4,-20(s0)     -> Load stored value of 763 into a4 register
  // lw a5,-24(s0)     -> Load stored value of 15 into a5 register
  // add a5,a4,a5      -> Add 763 and 15 and store the result in register a5
  // sw a5,-28(s0)     -> Store a5 into memory, memory address -28(s0) is now known as variable result

  // three memory locations have been written to which correspond to the three used variables

  return 23;
  // Compiled to:
  // addi a5,zero,23   -> Load 23 into register a5
  // addi a0,a5,0      -> Move the value from a5 to a0, a0 is known as return value
  // lw s0,28(sp)      -> Load the previously stored stack pointer to the s0 register which is known as frame pointer
  // addi sp,sp,32     -> add 32 to the stack pointer, this resets the stack pointer to where it was before the function main
  // jalr zero,0(ra)   -> Jump to the instruction which was after the jumo to the main function
}
