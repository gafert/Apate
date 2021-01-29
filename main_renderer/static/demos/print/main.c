#include "sim.h"

void print(const char *p) {
    while (*p) {
        SERIAL = *(p++);
    }
}

int main(void) {
    char *p = "I am in the terminal tab";
    print(p);

  	return 0;
}
