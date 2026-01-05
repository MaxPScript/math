// import "../my_junctions/webcomponents/GmCanvas/index.js";
//
import { clear, drawTriangle } from "../libs/canvasUtils.js";
import { hypotenuse } from "../libs/geometryUtils.js";
window.onload = (e) => {
	const canvas = document.getElementById("pyCanvas");
	const ctx = canvas.getContext("2d");
	// ctx.beginPath();
	// ctx.moveTo(0, 0);
	// ctx.lineTo(50, 50);
	// ctx.stroke();
	// console.log(canvas);
	// const aSlider = document.getElementById("sideA");
	// const bSlider = document.getElementById("sideB");
	const A = { x: 150, y: 0 };
	const B = { x: 0, y: 75 };
	const C = { x: 300, y: 75 };
	drawTriangle(ctx, A, B, C);
	(function draw() {
		// clear(ctx);
		console.log("inside draw");
		// ctx.beginPath();
		// ctx.moveTo(0, 0);
		// ctx.lineTo(50, 50);
		// ctx.stroke();
		// const a = Number(aSlider.value);
		// const b = Number(bSlider.value);

		// const A = { x: 50, y: 350 };
		// const B = { x: 50 + a, y: 350 };
		// const C = { x: 50, y: 350 - b };
		// const A = { x: 50, y: 350 };
		// const B = { x: 50, y: 350 };
		// const C = { x: 50, y: 350 };

		// drawTriangle(ctx, A, B, C);

		// Show lengths
		// ctx.fillText(`a = ${a}`, (A.x + B.x) / 2, A.y + 15);
		// ctx.fillText(`b = ${b}`, A.x - 40, (A.y + C.y) / 2);
		// ctx.fillText(
		// 	`c = ${hypotenuse(a, b).toFixed(2)}`,
		// 	(B.x + C.x) / 2,
		// 	(B.y + C.y) / 2
		// );
	})();

	// aSlider.oninput = draw;
	// bSlider.oninput = draw;

	// draw();

	// === Exercise ===
	// const checkBtn = document.getElementById("checkBtn");
	// const feedback = document.getElementById("feedback");

	// checkBtn.onclick = () => {
	// 	const userAnswer = Number(document.getElementById("answer").value);
	// 	const correct = hypotenuse(3, 4);

	// 	if (Math.abs(userAnswer - correct) < 0.001) {
	// 		feedback.textContent = "Correct!";
	// 		feedback.style.color = "green";
	// 	} else {
	// 		feedback.textContent = "Try again.";
	// 		feedback.style.color = "red";
	// 	}
	// };
};
