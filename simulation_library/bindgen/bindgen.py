#!/usr/bin/env python3

"""
This script generates a binding to verilated variables in a shared library to node-ffi.
It generates bindings for all variables which are found in the verilated header file (Vtop_entity.h)
with the following layout:

CData/*0:4*/ top__DOT__variable;
IData/*0:30*/ top__DOT__other_variable;
...

The bound variables will change dynamically in js if they are changed in the library.
They can also be written two as the share the same address.

It generates:
    * bindings.h which should be included in your exported header
    * bindings.cc which accesses the top component from Verilator
    * bindings.ts which uses node-ffi definitions to bind local variables to the verilated variables via pointers

Usage:
First generate the verilated files with Verilator, then:

python3 bindgen.py in_verilated_files_folder top_name out_cpp_bindings_folder out_ts_bindings_folder

Attention:
top_name needs to be the same as the filename it is in
Vyour_top_entity top* -> the variable name needs to be top as it is used in the generated .cc file

"""

import sys
import re
import datetime
from inflection import camelize

top_name = sys.argv[2]
file_to_verilated_header = f"""{sys.argv[1]}/V{top_name}.h"""
file_to_verilated_header_dpi = f"""{sys.argv[1]}/V{top_name}__dpi.h"""
cc_out_filename = sys.argv[3] + "/bindings.cc"
header_out_filename = sys.argv[3] + "/bindings.h"
ffi_out_filename = sys.argv[4] + "/bindings.ts"

print("Verilated Header File:", file_to_verilated_header)
print("Verilated Header DPI File:", file_to_verilated_header)
print("Top Name:", top_name)
print(".cc Out Name:", cc_out_filename)
print(".h Out Name:", header_out_filename)
print(".ts Out Name:", ffi_out_filename)

verilated_file = open(file_to_verilated_header, "r")
verilated_file_dpi = open(file_to_verilated_header_dpi, "r")
header_out_file = open(header_out_filename, "w")
cc_out_file = open(cc_out_filename, "w")
ffi_out_file = open(ffi_out_filename, "w")

function_pre_def = 'get_pointer_'


def get_c_datatype_from_string(vartype: str):
    """:returns The type used in the C files"""
    if vartype == 'CData':
        return 'uint8_t'
    if vartype == 'SData':
        return 'uint16_t'
    if vartype == 'IData' or vartype == 'EData' or vartype == 'WData':
        return 'uint32_t'
    if vartype == 'QData':
        return 'unsigned long int'


def get_ffi_write_function_from_string(vartype: str):
    """:returns The function to write a type using javascript ffi"""
    if vartype == 'CData':
        return 'writeUInt8'
    if vartype == 'SData':
        return 'writeUInt16LE'
    if vartype == 'IData' or vartype == 'EData' or vartype == 'WData':
        return 'writeUInt32LE'
    if vartype == 'QData':
        return 'writeUInt32LE'


def get_ffi_datatype_from_string(vartype: str):
    """:returns The type used in javascript ffi"""
    if vartype == 'CData':
        return 'uint8'
    if vartype == 'SData':
        return 'uint16'
    if vartype == 'IData' or vartype == 'EData' or vartype == 'WData':
        return 'uint32'
    if vartype == 'QData':
        return 'ulonglong'
    if vartype == 'void':
        return 'void'


class Variable(object):
    name: str
    vartype: str
    comment: str
    isarray: bool
    arraylenght: int

    def __init__(self, name, vartype, comment, isarray, arraylenght):
        self.name = name
        self.vartype = vartype
        self.comment = comment
        self.isarray = isarray
        self.arraylenght = arraylenght


# ---------------------------------------------------
# Get variables from verilog .h file
# --------------------------------------------------

# Variables
variables = []

for line in verilated_file:
    m = re.search('(CData|SData|IData|QData|EData|WData)(\s*)(\/\*\d+:\d+\*\/)(\s*)(' + top_name + ')', line)
    if m is not None:
        # This line has a variable we want to expose
        t = re.search('(CData|SData|IData|QData|EData|WData)', line)
        m = re.search('(?<=(' + top_name + '__DOT__)).+?(?=;|\[)', line)
        c = re.search('(\/\*\d+:\d+\*\/)', line)
        a = re.search('((\[)(\d+)(\]))', line)
        variables.append(Variable(m.group(), t.group(), c.group(), a is not None, a.group(3) if a is not None else 0))


class FunctionArguments(object):
    name: str
    type: str

    def __init__(self, name, type):
        self.name = name
        self.type = type


class DPIFunction(object):
    return_type: str
    name: str
    arguments: []

    def __init__(self, name, return_type, arguments):
        self.return_type = return_type
        self.name = name
        self.arguments = arguments


# ---------------------------------------------------
# Get DPI Functions from verilog dpi.h file
# --------------------------------------------------

functions = []

for line in verilated_file_dpi:
    m = re.search('(?:extern )(\w+)(?: )(\w+)(?:\()(.+?(?=\)))', line)
    if m is not None:
        # This line has a variable we want to expose
        arguments = re.findall('(int)(?: )(\w+)', m.group(3))
        parsed_arguments = []
        for argument in arguments:
            parsed_arguments.append(FunctionArguments(argument[1], argument[0]))

        functions.append(DPIFunction(m.group(2), m.group(1), parsed_arguments))

# ---------------------------------------------------
# Generate .h file
# --------------------------------------------------

header_out_file.write(
    f"""/**
  * Generated by bindgen.py
  * Date: {str(datetime.datetime.now())}
  *
  * Usage in your own exported header file:
  * --------------------------------------------------
  * #include "bindings.h"
  *
  * extern "C" void example_function();
  *
  */

""")
header_out_file.write('#include <cstdint>\n')
header_out_file.write('#include "Vtestbench_Export.h"\n\n')

header_out_file.write('#ifdef __cplusplus\nextern "C" {\n#endif\n\n')
for variable in variables:
    line = 'Vtestbench_EXPORT ' + get_c_datatype_from_string(variable.vartype) + ' *' + function_pre_def + variable.name + '();\n'
    header_out_file.write(line)

header_out_file.write("\n")

for function in functions:
    line = f"""typedef {function.return_type} (*{function.name}_t)("""
    for i, argument in enumerate(function.arguments):
        line = line + f"""{argument.type} {argument.name}"""
        if i == len(function.arguments) - 1:
            line = line + ");\n"
        else:
            line = line + ", "
    line = line + f"""Vtestbench_EXPORT void set_{function.name}_callback({function.name}_t function);\n"""
    header_out_file.write(line)

header_out_file.write('\n#ifdef __cplusplus\n}\n#endif\n\n')

# ---------------------------------------------------
# Generate .cc file
# ---------------------------------------------------

cc_out_file.write(
    f"""/**
  * Generated by bindgen.py
  * Date: {str(datetime.datetime.now())}
  *
  * Usage in your own cpp code:
  * --------------------------------------------------
  * #include "bindings.cc"
  *
  * V{top_name} *top;
  *
  * void example_function() \u007B
  *     Verilated::commandArgs(0, (char **) "");
  *     top = new V{top_name};
  * \u007D
  *
  */

""")
cc_out_file.write(f"""#include "bindings.h"\n#include "V{top_name}.h"\n\n""")

cc_out_file.write('extern V' + top_name + ' *top;\n\n')
for variable in variables:
    line = '/** Returns pointer of '
    if variable.isarray:
        line = line + get_c_datatype_from_string(variable.vartype) + ' array with length ' + str(variable.arraylenght)
    else:
        line = line + get_c_datatype_from_string(variable.vartype)
    line = line + ' */\n'
    line = line + get_c_datatype_from_string(variable.vartype) + ' *' + function_pre_def + variable.name + '() { '
    line = line + 'return (' + get_c_datatype_from_string(variable.vartype) + '*) ' + (
        '&' if not variable.isarray else '') + 'top->' + top_name + '__DOT__' + variable.name + '; }\n\n'
    cc_out_file.write(line)

for function in functions:
    line = f"""{function.name}_t {function.name}_callback;\n"""
    line = line + f"""{function.return_type} {function.name}("""
    for i, argument in enumerate(function.arguments):
        line = line + f"""{argument.type} {argument.name}"""
        if i == len(function.arguments) - 1:
            line = line + ") { "
        else:
            line = line + ", "
    line = line + f"""{function.name}_callback("""
    for i, argument in enumerate(function.arguments):
        line = line + f"""{argument.name}"""
        if i == len(function.arguments) - 1:
            line = line + "); }\n"
        else:
            line = line + ", "
    line = line + f"""void set_{function.name}_callback({function.name}_t function) \u007B {function.name}_callback = function; \u007D\n"""
    cc_out_file.write(line)

# ---------------------------------------------------
# Generate .ts files
# ---------------------------------------------------

ffi_out_file.write(
    f"""/**
  * Generated by bindgen.py
  * Date: {str(datetime.datetime.now())}
  *
  * Usage in your own code:
  * --------------------------------------------------
  * import bindings from "./bindings";
  *
  * let library = new Library('libV{top_name}.dylib',
  *    \u007B
  *      'example_function': ['void', []],
  *      ...bindings.function_definitions
  *    \u007D);
  *
  * bindings.setPointers(library);
  * library.example_function();
  *
  */

""")

ffi_out_file.write('import ref from "ref-napi";\n')
ffi_out_file.write('import {Callback} from "ffi-napi";\n')
ffi_out_file.write('import {BehaviorSubject} from "rxjs";\n')
ffi_out_file.write("const ArrayType = require('ref-array-di')(ref);\n\n")
ffi_out_file.write("export class Bindings {\n")

for function in functions:
    line = "  private " + camelize(function.name, False) + "Callbacks = [];\n"
    ffi_out_file.write(line)

    line = "  private " + camelize(function.name, False) + "Callback = Callback('" + get_ffi_datatype_from_string(
        function.return_type) + "', ["
    for i, arg in enumerate(function.arguments):
        line = line + "'" + arg.type + "'"
        if i < len(function.arguments) - 1:
            line = line + ","

    line = line + "], ("
    for i, arg in enumerate(function.arguments):
        line = line + arg.name
        if i < len(function.arguments) - 1:
            line = line + ","

    line = line + ") => this.call" + camelize(function.name) + "Callbacks("
    for i, arg in enumerate(function.arguments):
        line = line + arg.name
        if i < len(function.arguments) - 1:
            line = line + ","

    line = line + "));\n"

    ffi_out_file.write(line)

    line = "  private call" + camelize(function.name) + "Callbacks("
    for i, arg in enumerate(function.arguments):
        line = line + arg.name
        if i < len(function.arguments) - 1:
            line = line + ","
    line = line + ") {\n"
    line = line + "    for (let callback of this." + camelize(function.name, False) + "Callbacks) {\n"
    line = line + "      callback("
    for i, arg in enumerate(function.arguments):
        line = line + arg.name
        if i < len(function.arguments) - 1:
            line = line + ","
    line = line + ");\n    }\n  }\n"

    line = line + "  public add" + camelize(function.name) + "Callback(fun) {\n"
    line = line + "    this." + camelize(function.name, False) + "Callbacks.push(fun);\n"
    line = line + "  }\n"

    ffi_out_file.write(line)

for variable in variables:
    line = '  public ' + variable.name + "__subject: BehaviorSubject<number> = new BehaviorSubject<number>(null);\n"
    if not variable.isarray:
        line = line + '\n  private ' + variable.name + "__pointer = ref.alloc('" + get_ffi_datatype_from_string(
            variable.vartype) + "');\n"
        line = line + '  get ' + variable.name + '() {\n    // @ts-ignore\n    return this.' + variable.name + '__pointer.deref(); }\n'
        line = line + '  set ' + variable.name + '(value) { this.' + variable.name + '__pointer.' + \
               get_ffi_write_function_from_string(variable.vartype) + '(value, 0); }\n'
    else:
        line = line + '  public ' + variable.name + " = new ArrayType('" + get_ffi_datatype_from_string(
            variable.vartype) + "')(" + str(variable.arraylenght) + ');\n'
    ffi_out_file.write(line)

ffi_out_file.write("\n\n  public setPointers(library: any) {\n")
for variable in variables:
    if not variable.isarray:
        line = '    this.' + variable.name + "__pointer = library." + function_pre_def + variable.name + "();\n"
    else:
        line = '    this.' + variable.name + ".buffer = library." + function_pre_def + variable.name + "();\n"

    ffi_out_file.write(line)

for function in functions:
    line = "    library.set_" + function.name + "_callback(this." + camelize(function.name, False) + "Callback);\n"
    line = line + "    process.on('exit', () => { this." + camelize(function.name, False) + "Callback });\n"
    ffi_out_file.write(line)

ffi_out_file.write('  }')

ffi_out_file.write("\n\n  public function_definitions = {\n")
for i, variable in enumerate(variables):
    line = "    '" + function_pre_def + variable.name + "': ['" + get_ffi_datatype_from_string(
        variable.vartype) + " *', []]"
    if i < len(variables) - 1:
        line = line + ',\n'
    ffi_out_file.write(line)
for i, function in enumerate(functions):
    line = f""",\n    'set_{function.name}_callback': ['void', ['pointer']]"""
    if i < len(variables) - 1:
        line = line + '\n'
    ffi_out_file.write(line)

ffi_out_file.write('  }\n')

ffi_out_file.write("""  detectValueChanged() {
    setTimeout(() => {\n""")

for i, variable in enumerate(variables):
    line = "      if(this." + variable.name + " != this." + variable.name + "__subject.value) {\n"
    line +="         this." + variable.name + "__subject.next(this." + variable.name + ");\n      }\n"
    ffi_out_file.write(line)

ffi_out_file.write("""      this.detectValueChanged();
    }, 100);\n   }\n""")

ffi_out_file.write('}\nexport default new Bindings();\n')
