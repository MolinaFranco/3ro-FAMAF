// N = 20
// x0 = i
// x21 = stole
// x20 = res



minloop:
	ADD x0, xzr, x8
	SUB x20, x20, x1
	CBZ x20, setloop
	CBZ xzr, minloop
setloop:

loop:
	STUR x21, [x0, #0]
	ADD x20, x20, x21
	SUB x0, x0, x8

	CBZ x0, end
	CBZ xzr, loop
end:
	SUB x21, x22, x1

infloop:
	CBZ xzr,infloop
