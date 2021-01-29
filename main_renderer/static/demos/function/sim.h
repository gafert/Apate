#include <stdint.h>

#ifndef SIM_HEADER
#define SIM_HEADER

// Writes to special location which is catches by the memory write block to display the value in the terminal
#define SERIAL (*((volatile uint32_t *) 23456))

// All variables use two's complement
// The 32 bit integer is 1 bit for the sign and 31 bits for the value
#define MAX_INT 2147483647
#define MIN_INT -2147483648
  
// Direct register access
// Put a variable to a specific register
#define INIT_REG_A0 register int a0 asm ("a0");
#define REG_A0 a0

#define INIT_REG_A1 register int a1 asm ("a1");
#define REG_A1 a1
  
#define INIT_REG_A2 register int a2 asm ("a2");
#define REG_A2 a2
  
#define INIT_REG_A3 register int a3 asm ("a3");
#define REG_A3 a3
  
#endif // SIM_HEADER