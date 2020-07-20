add_custom_target(GenerateBinding
        DEPENDS GenerateBinding_Requirements
        COMMAND python ${CMAKE_CURRENT_SOURCE_DIR}/bindgen/bindgen.py ${CMAKE_CURRENT_SOURCE_DIR}/verilated_sources testbench ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/../src/app/core/services/sim-lib-interface ${CMAKE_CURRENT_SOURCE_DIR}/../simulation_library_worker)

add_custom_target(GenerateBinding_Requirements
        COMMAND pip install -r ${CMAKE_CURRENT_SOURCE_DIR}/bindgen/requirements.txt)

