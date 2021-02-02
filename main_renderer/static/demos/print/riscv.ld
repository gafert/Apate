SECTIONS
{
  .text.init : {
    *(.text.init)
  }

  .text : {
    *(.text)
  }

  .data : {
    *(.bss)
    *(.sdata)
    *(.rodata)
    *(.data*)
    *(.got*)
  }
}
