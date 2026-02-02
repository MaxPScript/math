import { InteractiveSection } from "./components/interactive_section_class.js";
//
const gate = document.querySelector("interaction-gate");
if (!gate) {
	console.log("Can not found <interaction-gate> element");
}
waitForAppReady().then(() => {
	gate.unlock();
});
function waitForAppReady() {
	return Promise.all([waitForImages(), waitForAudio()]);
}
function waitForImages() {
	const images = [
		"./assets/img/layout_1536_1024.webp",
		"./assets/img/gate.webp",
	];
	return Promise.all(
		images.map((src) => {
			return new Promise((resolve) => {
				const img = new Image();
				img.src = src;
				img.onload = resolve;
				img.onerror = resolve;
			});
		}),
	);
}
function waitForAudio() {
	const sounds = ["./assets/audio/hover_6.wav"];
	return Promise.all(
		sounds.map((src) => {
			return new Promise((resolve) => {
				const audio = new Audio(src);
				audio.addEventListener("canplaythrough", resolve, { once: true });
				audio.addEventListener("error", resolve, { once: true });
			});
		}),
	);
}
//
document
	.querySelectorAll("[data-interactive]")
	.forEach((el) => new InteractiveSection(el));
