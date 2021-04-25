
<img src="https://user-images.githubusercontent.com/26965341/116008549-7311c300-a615-11eb-982e-630efdbb3523.gif" width="100%" />

![Screenshot](https://github.com/gafert/Apate/blob/master/github_resources/apate.png?raw=true)


<hr>


This simulator is a tool for students to learn the inner workings of a CPU. It is based on the RISC-V instruction set architecture (RV32I) and provides a visual step by step guide through a CPU. __[Watch the introduction video!](https://onedrive.live.com/embed?cid=7DB401F01603F3FF&resid=7DB401F01603F3FF%21387672&authkey=AIt0zApVbDVJKUc)__



# Downloads ![Build/release](https://github.com/gafert/Apate/workflows/Build/release/badge.svg) ![GitHub all releases](https://img.shields.io/github/downloads/gafert/apate/total?color=blue)


<table style="width=100%">
  <tr>
    <th>
      Windows
    </th>
    <th>
      macOS
    </th>
    <th>
       Linux
    </th>
  </tr>
   <tr>
    <td>
      <a href="https://github.com/gafert/Apate/releases/latest/download/Apate-1.0.5.exe">
        <img src="https://img.shields.io/badge/download-Apate--1.0.5.exe-blue">
      </a>
    </td>
    <td>
      <a href="https://github.com/gafert/Apate/releases/latest/download/Apate-1.0.5.dmg">
        <img src="https://img.shields.io/badge/download-Apate--1.0.5.dmg-blue"></a>
    </td>
    <td>
      <a href="https://github.com/gafert/Apate/releases/latest/download/Apate-1.0.5.AppImage">
        <img src="https://img.shields.io/badge/download-Apate--1.0.5.AppImage-blue">
      </a>
    </td>
  </tr>
  <tr>
    <td colspan=3>    
      See older versions in the <a href="https://github.com/gafert/Apate/releases">releases</td>
  </tr>
</table>


# Features

* Step by step guid through the CPU
* See the current instruction and what that instruction does
* Information about each element and signal of the CPU
* See all registers, memory
* Run examples
* Compile your own code with integrated editor and compiler
* Complex CPU elements simplified
* Not focused on speed, verification, completeness or correct depiction of HDL but on principles of teaching

# Under the hood

* Runs on [electron](https://www.electronjs.org/)
* Visualisation with [three.js](https://github.com/mrdoob/three.js) and SVGLoader
* Interface with Angular
* Custom JavaScript ELF parser
* Custom JavaScript instruction decoder
* Custom JavaScript CPU based RV32I ISA

Thank you to [@jameslzhu](https://github.com/jameslzhu)
for [RISC V Reference Sheet](https://github.com/jameslzhu/riscv-card), and [@anvaka](https://github.com/anvaka)
for [three.map.control](https://github.com/anvaka/three.map.control). Other used packages are in the packages.json.




