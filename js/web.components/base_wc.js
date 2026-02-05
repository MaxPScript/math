const MEDIA = {
	imgSrc: "../../assets/img/layout_1536_1024.webp",
	imgW: 1536,
	imgH: 1024,
	soundSrc: "../../assets/audio/hover_6.wav",
};
//
export class BaseWC extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	getProps() {
		const props = {};
		for (const name of this.getAttributeNames()) {
			if (!name.startsWith("data-")) {
				props[name] = this.getAttribute(name);
			}
		}
		return { ...props, ...this.dataset, ...MEDIA };
	}
	set html(template) {
		this.shadowRoot.innerHTML = template;
	}
	// get element having base image as a bg
	async getRefElement(selector) {
		// wait for one frame of rendering...
		await new Promise((res) => requestAnimationFrame(res));
		const el = document.querySelector(selector);
		return el ? el : null;
	}
}
