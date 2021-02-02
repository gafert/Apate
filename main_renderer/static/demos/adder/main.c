#include "sim.h"

/**

Simple adder.

Step by step:

First elements from start.s as entry symbol


Then main.c

Setup function until PC 28. Then the custom code starts.

// int number1 = 15;
Load 15 into register 5
Store register 5 into memory

// int number2 = 763;
Load 763 into register 5
Store register 5 into memory

// int result = number1 + number2;
Load 15 into register 4
Load 763 into register 5
Add register 4 and register 5 into register 5
Store register 5 into memory

**/

int main(void) {
  int number1 = 15; // LI = Will be loaded immediately
  int number2 = 763; // LI = Will be loaded immediately
  int result = number1 + number2; // ADD
  return 23;
}
