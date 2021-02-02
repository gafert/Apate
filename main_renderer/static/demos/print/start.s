.section .text.init
entry:
  /* set stack pointer */
  lui sp, %hi(512)
  addi sp, sp, %lo(512)

  call  main          # call the main function
  ecall               # halt the simluation when it returns
