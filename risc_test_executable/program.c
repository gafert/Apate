#include <stdint.h>
#include "sim.h"

void print(const char *p) {
    while (*p) {
        SERIAL = *(p++);
    }
}

int main(void) {
    // Integer functions

    int max = MAX_INT;
    int min = MIN_INT;
    int a = max + min; // = -1

  	if(max == 5) {
    	a += 5;
    }

  	if(max >= 5) {
    	a += 5;
    }

  	if(max < 5) {
    	a += 5;
    }

  	if(max != 5) {
    	a += 5;
    }


  	// Function calls and memory access
    char *p = "Mamamamamamam";
    print(p);


  	// Direct reg access
  	INIT_REG_A0;
    INIT_REG_A1;
  	REG_A0 = 0xDEAD;
  	REG_A1 = 0xBEEF;
  	return 0;
}
