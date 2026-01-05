export function clear(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawLine(ctx, x1, y1, x2, y2) {
	console.log("drawLine");
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

export function drawTriangle(ctx, A, B, C) {
	console.log("drawTriangle");
	console.log(A);
	drawLine(ctx, A.x, A.y, B.x, B.y);
	drawLine(ctx, B.x, B.y, C.x, C.y);
	drawLine(ctx, C.x, C.y, A.x, A.y);
}
