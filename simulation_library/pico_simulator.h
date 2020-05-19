#include "bindings.h"

#ifdef __cplusplus
extern "C" {
#endif

Vtestbench_EXPORT void advance_simulation_with_clock();
Vtestbench_EXPORT void advance_simulation_with_pc();
Vtestbench_EXPORT void advance_simulation_with_statechange();
Vtestbench_EXPORT void init_simulation(char *path_to_hex);

#ifdef __cplusplus
}
#endif