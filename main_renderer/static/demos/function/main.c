// #include "sim.h" // not needed in this example

int exampleFunction(int parameter) {
  int localVariable = 3;
  return localVariable;
}

int main(void) {
  int parameter = 34;
  int returnValue = exampleFunction(parameter);
  return returnValue;
}
