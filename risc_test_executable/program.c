#include <stdint.h>

// Writes to special location which is catches by the memory write block to display the value in the terminal
#define SERIAL (*((volatile uint32_t *) 23456))

// All variables use two's complement
// The 32 bit integer is 1 bit for the sign and 31 bits for the value
#define MAX_INT 2147483647
#define MIN_INT -2147483648

void print(const char *p) {
    while (*p) {
        SERIAL = *(p++);
    }
}

int main(void) {
    volatile int max = MAX_INT;
    volatile int min = MIN_INT;
    volatile int a = max + min;
    const char *p = "Definitv nicht\n";
    print(p);
}
