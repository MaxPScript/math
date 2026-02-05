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
	async connectedCallback() {
		const props = this.getProps();
		// console.log(props);
		const refElement = await this.getRefElement(props.ref);
		this.render(props, refElement);
		this.observeResize(props, refElement);
		this.attachAudio(props);
	}
	render(props, refElement) {
		this.html = `
    <style>
        :host {
            position: absolute !important;
            display: block;
            // z-index: 1;
        }
        button {
            all: unset;
            display: block;
            width: 100%;
            height: 100%;
            // background: hsl(200 50% 50% / 0.4);
            outline: 5px dashed green;
            cursor: pointer;
        }
    </style>
    <button part="button">Click</button>
        `;
		this.renderBackground(props);
		this.computeLayout(props, refElement);
	}
	//
	async loadImage(props) {
		if (this._img) return this._img;
		const img = new Image();
		img.src = props.imgSrc;
		await img.decode();
		this._img = img;
		return img;
	}
	async renderBackground(props) {
		const img = await this.loadImage(props);
		const canvas = document.createElement("canvas");
		const [x, y, w, h] = props.cut.split(" ").map(Number);
		// console.log(x, y, w, h);
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		this.style.backgroundImage = `url(${canvas.toDataURL("image/webp")})`;
		this.style.backgroundSize = "cover";
		//
	}
	computeLayout(props, refElement) {
		const [x, y, w, h] = props.cut.split(" ").map(Number);
		// console.log(props.ref);
		// console.log(refElement);
		// const refElement = document.getElementById(`${props.ref}`);
		const refRect = refElement.getBoundingClientRect();
		const srcImgRatio = props.imgW / props.imgH;
		const refElRatio = refRect.width / refRect.height;
		// rendering box for this
		const render = { x: 0, y: 0, w: 0, h: 0 };

		if (refElRatio > srcImgRatio) {
			render.h = refRect.height;
			render.w = render.h * srcImgRatio;
			render.x = (refRect.width - render.w) / 2;
		} else {
			render.w = refRect.width;
			render.h = render.w / srcImgRatio;
			render.y = (refRect.height - render.h) / 2;
		}
		// normalizing
		const nx = x / props.imgW;
		const ny = y / props.imgH;
		const nw = w / props.imgW;
		const nh = h / props.imgH;
		//
		this.style.left = `${nx * render.w + render.x}px`;
		this.style.top = `${ny * render.h + render.y}px`;
		this.style.width = `${nw * render.w}px`;
		this.style.height = `${nh * render.h}px`;
		// this.render();
	}
	observeResize(props, refElement) {
		this.ro = new ResizeObserver(() => this.computeLayout(props, refElement));
		this.ro.observe(refElement);
	}
	attachAudio(props) {
		const soundSrc = props.soundSrc;
		const audio = new Audio(soundSrc);
		this.addEventListener("mouseenter", () => {
			audio.currentTime = 0;
			audio.play().catch(() => {
				console.log(this);
			});
		});
	}

	// init() {
	// }
	// readAttributes_2() {
	// const d = this.el.dataset;
	// const d_2 = this.containerForButtons.dataset;

	// this.srcImg = d_2.srcImg;
	// this.srcImgWidth = +d_2.srcImgWidth;
	// this.srcImgHeight = +d_2.srcImgHeight;

	// const cut = this.getAttribute("cut");
	// const [x, y, w, h] = cut.split(" ").map(Number);
	// this.computeLayout(x, y, w, h);
	// this.cutX = +d.cutX;
	// this.cutY = +d.cutY;
	// this.cutW = +d.cutW;
	// this.cutH = +d.cutH;
	// }
	//

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
