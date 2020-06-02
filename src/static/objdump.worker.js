const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');

onmessage = (e) => {
  let filePath = e.data.file;
  let objdumpPath = e.data.objdumpPath;

  let stdout = String(execSync(`"${objdumpPath}" --section .text.init --section .text --section .data --full-contents --disassemble --syms --wide --source -z "${filePath}"`));

  // Format assembly from objdump

  let sections = [];

  const symbolInSectionRegex = /(?<hex>\d{8})(\s)(<)(?<name>\w*)(>:)/;
  const sectionRegex = /(?:Disassembly\sof\ssection\s)(?<section>.+?(?=:))/;
  const assemblyRegex = /(?<pc>\w{1,4})(?::\s)(?<hex>\w{8})(?:\s+)(?<opcode>[^\s]*)(?:\s+)(?<args>[^\s]+)/;

  const lines = stdout.split('\n');
  let currentSectionIndex = null;
  let currentSymbolIndex = null;

  for (let l of lines) {
    let line = l.toString();
    const sectionMatch = line.match(sectionRegex);
    const symbolMatch = line.match(symbolInSectionRegex);
    const assemblyMatch = line.match(assemblyRegex);

    if (sectionMatch) {
      // New section
      currentSectionIndex = sections.push({name: sectionMatch.groups.section, symbols: []}) - 1;
      currentSymbolIndex = null;
    } else if (symbolMatch && currentSectionIndex !== null) {
      // New symbol
      currentSymbolIndex = sections[currentSectionIndex].symbols.push({
        name: symbolMatch.groups.name,
        hex: symbolMatch.groups.hex,
        code: []
      }) - 1;
    } else if (assemblyMatch && currentSymbolIndex !== null && currentSectionIndex !== null) {
      sections[currentSectionIndex].symbols[currentSymbolIndex].code.push({
        assembly: [{
          opcode: "" + assemblyMatch.groups.opcode + " " + assemblyMatch.groups.args,
          hex: assemblyMatch.groups.hex,
          pc: parseInt(assemblyMatch.groups.pc, 16)
        }]
      });
    }
  }

  postMessage(sections);

  //fs.readFile(e.data, {encoding: 'utf-8'}, function (err, data) {
  //});
};
