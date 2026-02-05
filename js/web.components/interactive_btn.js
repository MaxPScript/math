import { BaseWC } from "./base_wc.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: absolute;
            display: block;
            z-index: 1;
        }
        button {
            all: unset;
            width: 100%;
            height: 100%;
            background: hsl(200 50% 50% / 0.4);
            cursor: pointer;
        }
    </style>
    <button part="button"></button>
`;
class InteractiveButton extends BaseWC {
	constructor() {
		super();
		// this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		const props = this.getProps();
		console.log(props);
		this.render(props);
	}
	render(props) {
		this.html = `
    <style>
        :host {
            position: absolute !important;
            display: block;
            z-index: 1;
        }
        button {
            all: unset;
            width: 100%;
            height: 100%;
            background: hsl(200 50% 50% / 0.4);
            cursor: pointer;
        }
    </style>
    <button part="button">Click</button>
        `;
	}
	// init() {
	// }
	readAttributes_2() {
		const d = this.el.dataset;
		const d_2 = this.containerForButtons.dataset;

		this.srcImg = d_2.srcImg;
		this.srcImgWidth = +d_2.srcImgWidth;
		this.srcImgHeight = +d_2.srcImgHeight;

		const cut = this.getAttribute("cut");
		const [x, y, w, h] = cut.split(" ").map(Number);
		this.computeLayout(x, y, w, h);
		// this.cutX = +d.cutX;
		// this.cutY = +d.cutY;
		// this.cutW = +d.cutW;
		// this.cutH = +d.cutH;
	}
	computeLayout(x, y, w, h) {
		const refRect = this.refElement.getBoundingClientRect();
		const srcRatio = this.srcImgWidth / this.srcImgHeight;
		const refRatio = refRect.width / refRect.height;
		// rendering box
		const render = { x: 0, y: 0, w: 0, h: 0 };

		if (refRatio > srcRatio) {
			render.h = refRect.height;
			render.w = render.h * srcRatio;
			render.x = (refRect.width - render.w) / 2;
		} else {
			render.w = refRect.width;
			render.h = render.w / srcRatio;
			render.y = (refRect.height - render.h) / 2;
		}
		// normalizing
		const nx = x / this.srcImgWidth;
		const ny = y / this.srcImgHeight;
		const nw = w / this.srcImgWidth;
		const nh = h / this.srcImgHeight;
		//
		this.render();
	}
	//
	async loadImage() {
		if (this._img) return this._img;
		const img = new Image();
		img.src = this.srcImg;
		await img.decode();
		this._img = img;
		return img;
	}
	// _applyCut() {
	// 	const cut = this.getAttribute("cut");
	// 	if (!cut) return;
	// 	const [x, y, w, h] = cut.split(" ").map(Number);
	// 	this.style.left = x + "px";
	// 	this.style.top = y + "px";
	// 	this.style.width = w + "px";
	// 	this.style.height = h + "px";
	// }
	// _applyAria() {
	// 	const label = this.getAttribute("aria-label");
	// 	if (label) {
	// 		this.button.setAttribute("aria-label", label);
	// 	}
	// }
	// _bindEvents() {
	// 	this.button.addEventListener("click", () => {
	// 		this.dispatchEvent(
	// 			new CustomEvent("interactive-activate", {
	// 				bubbles: true,
	// 				composed: true,
	// 				detail: {
	// 					type: this.getAttribute("type"),
	// 					ref: this.getAttribute("ref"),
	// 					cut: this.getAttribute("cut"),
	// 				},
	// 			}),
	// 		);
	// 	});
	// }
}
customElements.define("interactive-button", InteractiveButton);
