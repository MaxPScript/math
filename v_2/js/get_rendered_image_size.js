// function calculate element's background image dimensions
// also calculate elements's style.width/height
// also calculate elements's w/h from getBoundingClientRect method
// it then compares the results and concludes that the background image size
// matches the element size.
// This information can be useful for debugging, edge cases, and so on.
// All my code may be incorrect. Always do testing.
export function getRenderedBgSize(el) {
	return new Promise((res, rej) => {
		//
		const compareObject = {
			getComputedStyle: {
				width: 0,
				height: 0,
			},
			getBoundingClientRect: {
				width: 0,
				height: 0,
			},
			fromCalcBgImage: {
				width: 0,
				height: 0,
			},
		};
		const style = window.getComputedStyle(el);
		const rect = el.getBoundingClientRect();
		compareObject.getComputedStyle.width = parseFloat(style.width);
		compareObject.getComputedStyle.height = parseFloat(style.height);
		compareObject.getBoundingClientRect.width = rect.width;
		compareObject.getBoundingClientRect.height = rect.height;
		//
		const bg = style.backgroundImage;
		if (!bg || bg === "none") {
			rej(new Error("No bg image found!"));
			return;
		}
		const bgUrl = bg.slice(4, -1).replace(/"/g, "");
		const img = new Image();
		img.src = bgUrl;
		//
		img.onload = () => {
			const containerW = el.offsetWidth;
			const containerH = el.offsetHeight;
			const imgW = img.naturalWidth;
			const imgH = img.naturalHeight;
			const ratio = imgW / imgH;
			let renderedW, renderedH;
			const bgSize = style.backgroundSize;
			console.log(bgSize);
			const containerRatio = containerW / containerH;
			if (bgSize === "cover") {
				if (containerRatio > ratio) {
					renderedW = containerW;
					renderedH = containerW / ratio;
				} else {
					renderedW = containerH * ratio;
					renderedH = containerH;
				}
			} else if (bgSize === "contain") {
				if (containerRatio > ratio) {
					renderedW = containerH * ratio;
					renderedH = containerH;
				} else {
					renderedW = containerW;
					renderedH = containerW / ratio;
				}
			} else if (bgSize.includes("px")) {
				const dims = bgSize.split(" ");
				renderedW = parseFloat(dims[0]);
				renderedH = dims[1] ? parseFloat(dims[1]) : renderedW / ratio;
			} else if (bgSize.includes("%")) {
				const [w, h] = bgSize.split(" ");
				renderedW = (parseFloat(w) / 100) * containerW;
				renderedH = h ? (parseFloat(h) / 100) * containerH : renderedW / ratio;
			} else {
				// Default: 'auto' or '100%'
				renderedW = containerW;
				renderedH = containerH;
			}
			compareObject.fromCalcBgImage.width = renderedW;
			compareObject.fromCalcBgImage.height = renderedH;
			res({
				renderedW: Math.round(renderedW),
				renderedH: Math.round(renderedH),
				imgW,
				imgH,
				containerW,
				containerH,
				compareObject,
			});
		};
		img.onerror = () => {
			rej(new Error("Failed to load bg image"));
		};
	});
}
