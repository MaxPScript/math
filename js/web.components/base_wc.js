import { config } from "../config.js";
// imgSrc: "../../assets/img/layout_1536_1024.webp",
// imgSrc: "../assets/img/layout_1536_1024.webp",
// const MEDIA = {
// 	imgRefEl: "#papyrus_id",
// 	imgSrc: "assets/img/layout_1536_1024.webp",
// 	imgW: 1536,
// 	imgH: 1024,
// 	soundSrc: "assets/audio/hover_6.wav",
// };
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
		return { ...props, ...this.dataset, ...config.media };
	}
	set html(content) {
		this.shadowRoot.innerHTML = "";
		if (content instanceof HTMLTemplateElement) {
			this.shadowRoot.appendChild(content.content.cloneNode(true));
		} else {
			this.shadowRoot.innerHTML = content;
		}
	}
	// get element having base image as a bg
	async getRefElement() {
		// wait for one frame of rendering...
		await new Promise((res) => requestAnimationFrame(res));
		const el = document.querySelector(config.media.imgRefEl);
		return el ? el : null;
	}
}
