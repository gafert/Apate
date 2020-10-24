#include <stdint.h>

void print(const char *p) {
    while (*p)
        *(volatile int *) 23456 = *(p++);
}


int main(void) {
    const char *p = "Okay\n";
  	print(p);
}
