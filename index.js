import { getRenderedBgSize } from "./js/get_rendered_image_size.js";
//
const papyrusSection = document.getElementById("papyrus_id");
// const s = await getRenderedBgSize(papyrusSection);
// console.log(s);
const historySection = document.getElementById("history_id");
//
const loadImageAndExtract = async (src, subRegion, sectionToAppend) => {
	// console.log(subRegion);
	const rect = papyrusSection.getBoundingClientRect();
	const container = {
		x: rect.x,
		y: rect.y,
		w: rect.width,
		h: rect.height,
	};
	console.log(container.w / container.h);
	const img = new Image();
	img.src = src;
	//
	await img.decode();
	//
	const srcCanvas = document.createElement("canvas");
	srcCanvas.width = img.width;
	srcCanvas.height = img.height;
	const srcCtx = srcCanvas.getContext("2d");
	srcCtx.drawImage(img, 0, 0);
	const pixels = srcCtx.getImageData(
		subRegion.x,
		subRegion.y,
		subRegion.w,
		subRegion.h,
	);
	console.log(pixels);
	const targetCanvas = document.createElement("canvas");
	targetCanvas.width = subRegion.w;
	targetCanvas.height = subRegion.h;
	const targetCtx = targetCanvas.getContext("2d");
	targetCtx.putImageData(pixels, 0, 0);
	//
	const dataUrl = targetCanvas.toDataURL("image/webp");
	//
	sectionToAppend.style.left = subRegion.x * (container.w / 1536) + "px";
	sectionToAppend.style.top = subRegion.y * (container.h / 1024) + "px";
	sectionToAppend.style.width = subRegion.w * (container.w / 1536) + "px";
	sectionToAppend.style.height = subRegion.h * (container.h / 1024) + "px";
	sectionToAppend.style.backgroundImage = `url(${dataUrl})`;
	sectionToAppend.style.backgroundSize = "cover";
};
//
loadImageAndExtract(
	"./assets/img/layout_1536_1024.webp",
	{ x: 980, y: 407, w: 286, h: 223 },
	historySection,
);
// DIALOG
const dialog = document.getElementById("interactionGate_id");
window.addEventListener("load", () => {
	dialog.showModal();
});
const btnClose = document.getElementById("closeInteractionGate_id");
btnClose.addEventListener("click", (ev) => {
	document.startViewTransition(() => {
		dialog.close();
	});
});
// AUDIO
const sound = new Audio("./assets/audio/hover_6.wav");
historySection.onmouseenter = () => {
	console.log("enter");
	sound.currentTime = 0;
	sound.play().catch((err) => {
		console.log("audio issue exists");
	});
};
