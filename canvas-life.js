const section = document.getElementById("papyrus");
const selection = document.getElementById("selection");

const inputs = {
	x: document.getElementById("x"),
	y: document.getElementById("y"),
	w: document.getElementById("w"),
	h: document.getElementById("h"),
};
// console.log(inputs);
const saveBtn = document.getElementById("save");

const img = new Image();
img.src = "../assets/img/layout_2.webp";

let buffer, bctx;

const DB = []; // ← fake DB for now

img.onload = () => {
	buffer = document.createElement("canvas");
	bctx = buffer.getContext("2d");
	buffer.width = img.width;
	buffer.height = img.height;
	bctx.drawImage(img, 0, 0);
	// updateInputs();
};

function updateInputs() {
	inputs.x.value = selection.offsetLeft;
	inputs.y.value = selection.offsetTop;
	inputs.w.value = selection.offsetWidth;
	inputs.h.value = selection.offsetHeight;
}

function updateSelection() {
	selection.style.left = inputs.x.value + "px";
	selection.style.top = inputs.y.value + "px";
	selection.style.width = inputs.w.value + "px";
	selection.style.height = inputs.h.value + "px";
}

Object.values(inputs).forEach((input) =>
	input.addEventListener("input", updateSelection),
);

// dragging
let dragging = false;
let offsetX, offsetY;

selection.addEventListener("mousedown", (e) => {
	dragging = true;
	offsetX = e.offsetX;
	offsetY = e.offsetY;
});

window.addEventListener("mousemove", (e) => {
	if (!dragging) return;
	const rect = section.getBoundingClientRect();
	selection.style.left = e.clientX - rect.left - offsetX + "px";
	selection.style.top = e.clientY - rect.top - offsetY + "px";
	updateInputs();
});

window.addEventListener("mouseup", () => (dragging = false));

// save region
saveBtn.addEventListener("click", () => {
	const rect = section.getBoundingClientRect();

	const x = selection.offsetLeft;
	const y = selection.offsetTop;
	const w = selection.offsetWidth;
	const h = selection.offsetHeight;

	const scaleX = buffer.width / rect.width;
	const scaleY = buffer.height / rect.height;

	const imageData = bctx.getImageData(
		x * scaleX,
		y * scaleY,
		w * scaleX,
		h * scaleY,
	);

	DB.push({ x, y, w, h, imageData });

	console.log("Saved regions:", DB);
	window.dispatchEvent(new CustomEvent("regionSaved", { detail: DB }));
});
// ***
// const section = document.getElementById("papyrus");

window.addEventListener("regionSaved", (e) => {
	const regions = e.detail;

	// clear previous
	document.querySelectorAll(".reveal-canvas").forEach((c) => c.remove());

	regions.slice(0, 2).forEach((region) => {
		const canvas = document.createElement("canvas");
		canvas.className = "reveal-canvas";

		canvas.width = region.w;
		canvas.height = region.h;
		canvas.style.left = region.x + "px";
		canvas.style.top = region.y + "px";

		const ctx = canvas.getContext("2d");
		ctx.putImageData(region.imageData, 0, 0);

		canvas.addEventListener("click", () => {
			canvas.style.opacity = 1;
		});

		section.appendChild(canvas);
	});
});
