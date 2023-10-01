

//	x0 posicion
//	x10 numero
	ADD x0, x20, x20
	ADD x10, xzr, x5
loop:
	STUR x10, [x0, #0]
	SUB x10, x10, x1
	SUB x0, x0, x8
	CBZ x0, end
	CBZ xzr, loop
end:

infLoop:
	cbz XZR, infLoop
