#include <stdint.h>

void print(const char *p) {
  while (*p)
    *(volatile int *) 23456 = *(p++);
}


int main(void) {
  const char *p = "Hi ich bin die Maschine und ich LEBE\n";
  print(p);
}
