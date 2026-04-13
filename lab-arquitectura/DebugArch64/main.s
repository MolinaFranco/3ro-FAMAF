	.data
	N:       .dword 4096	// Number of elements in the vectors
	Alpha:   .dword 2      // scalar value
	
	.bss 
	X: .zero  32768        // vector X(4096)*8
	Y: .zero  32768        // Vector Y(4096)*8
    Z: .zero  32768        // Vector Y(4096)*8

	.arch armv8-a
	.text
	.align	2
	.global	main
	.type	main, %function
main:
.LFB6:
	.cfi_startproc
	stp	x29, x30, [sp, -16]!
	.cfi_def_cfa_offset 16
	.cfi_offset 29, -16
	.cfi_offset 30, -8
	mov	x29, sp
	mov	x1, 0
	mov	x0, 0
	bl	m5_dump_stats

	ldr     x0, N
		ldr     x10, =Alpha
		ldr     x2, =X
		ldr     x3, =Y
	ldr     x4, =Z

//---------------------- CODE HERE ------------------------------------

	mov x8, #8
	ldr x9, =N     // Load the number of elements (N) into x9
	sub x9, x9, 1  // Decrementing the number of elements (N - 1)
	mul x9, x9, x8  // Multiplying by 8 to get the size of each element

startloop:
	ldr x11, [x2, x9]     // Load X[i]
	ldr x12, [x3, x9]     // Load Y[i]

	mul x13, x11, x10     // Calculate X[i] * Alpha
	add x10, x13, x12     // Calculate X[i] * Alpha + Y[i]

	str x10, [x4, x9]     // Store result in Z[i]

	sub x9, x9, 8         // Decrement i by 8
	cmp x9, #0            // Check if i < 0
	bge startloop          // Branch if greater than or equal to zero

//---------------------- END CODE -------------------------------------

	mov 	x0, 0
	mov 	x1, 0
	bl	m5_dump_stats
	mov	w0, 0
	ldp	x29, x30, [sp], 16
	.cfi_restore 30
	.cfi_restore 29
	.cfi_def_cfa_offset 0
	ret
	.cfi_endproc
.LFE6:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 9.4.0-1ubuntu1~20.04.1) 9.4.0"
	.section	.note.GNU-stack,"",@progbits
