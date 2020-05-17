#include "bindings.h"

#ifdef __cplusplus
extern "C" {
#endif

void advance_simulation_with_clock();
void advance_simulation_with_pc();
void advance_simulation_with_statechange();
void init_simulation(char *path_to_hex);

#ifdef __cplusplus
}
#endif