import { InteractiveSection } from "./components/interactive_section_class.js";
import { assetCache } from "./helpers/asset_cache.js";
import { config } from "./config.js";
//
const gate = document.querySelector("interaction-gate");
if (!gate) {
	console.log("Can not found <interaction-gate> element");
} else {
	// console.log(gate);
}
waitForAppReady().then(() => {
	gate.unlock();
});
function waitForAppReady() {
	return Promise.all([waitForAudio(), waitForImages()]);
}
function waitForAudio() {
	// const sounds = ["./assets/audio/hover_6.wav"];
	const sounds = [config.media.soundSrc];
	return Promise.all(
		sounds.map((src) => {
			return new Promise((resolve) => {
				const audio = new Audio(src);
				audio.addEventListener(
					"canplaythrough",
					assetCache.sounds.set(src, audio),
					resolve(),
					{ once: true },
				);
				audio.src = src;
				audio.load();
				// audio.addEventListener("error", resolve, { once: true });
			});
		}),
	);
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
