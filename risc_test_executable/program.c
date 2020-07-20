#include <stdint.h>

void print(const char *p) {
    while (*p)
        *(volatile int *) 0x10000000 = *(p++);
}

int main(void) {
    volatile int a = 5;
    const char *p = "Okay\n";
    print(p);
}