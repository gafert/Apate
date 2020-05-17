#include <stdint.h>

void print(const char *p) {
    while (*p)
        *(volatile int *) 0x10000000 = *(p++);
}

int main(void) {
    const char *p = "Hello from se program\n";
    print(p);
}
