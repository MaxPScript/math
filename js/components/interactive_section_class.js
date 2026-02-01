// js/components/InteractiveSection.js

export class InteractiveSection {
	constructor(el) {
		this.el = el;
		this.refSelector = el.dataset.ref || "#papyrus_id";
		this.refElement = document.querySelector(this.refSelector);

		if (!this.refElement) {
			console.warn("Reference element not found:", this.refSelector);
			return;
		}

		this.init();
	}

	init() {
		this.readAttributes();
		this.computeLayout();
		this.observeResize();
		this.attachAudio();
	}

	readAttributes() {
		const d = this.el.dataset;

		this.srcImg = d.srcImg;
		this.srcImgWidth = +d.srcImgWidth;
		this.srcImgHeight = +d.srcImgHeight;

		this.cutX = +d.cutX;
		this.cutY = +d.cutY;
		this.cutW = +d.cutW;
		this.cutH = +d.cutH;
	}

	computeLayout() {
		const refRect = this.refElement.getBoundingClientRect();

		const srcRatio = this.srcImgWidth / this.srcImgHeight;
		const refRatio = refRect.width / refRect.height;

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

		const nx = this.cutX / this.srcImgWidth;
		const ny = this.cutY / this.srcImgHeight;
		const nw = this.cutW / this.srcImgWidth;
		const nh = this.cutH / this.srcImgHeight;

		this.el.style.left = `${nx * render.w + render.x}px`;
		this.el.style.top = `${ny * render.h + render.y}px`;
		this.el.style.width = `${nw * render.w}px`;
		this.el.style.height = `${nh * render.h}px`;

		this.renderBackground();
	}

	async loadImage() {
		if (this._img) return this._img;

		const img = new Image();
		img.src = this.srcImg;
		await img.decode();

		this._img = img;
		return img;
	}

	async renderBackground() {
		if (!this.srcImg) return;

		const img = await this.loadImage();

		const canvas = document.createElement("canvas");
		canvas.width = this.cutW;
		canvas.height = this.cutH;

		const ctx = canvas.getContext("2d");
		ctx.drawImage(
			img,
			this.cutX,
			this.cutY,
			this.cutW,
			this.cutH,
			0,
			0,
			this.cutW,
			this.cutH,
		);

		this.el.style.backgroundImage = `url(${canvas.toDataURL("image/webp")})`;
		this.el.style.backgroundSize = "cover";
	}

	observeResize() {
		this.ro = new ResizeObserver(() => this.computeLayout());
		this.ro.observe(this.refElement);
	}

	attachAudio() {
		const soundSrc = this.el.dataset.sound;
		if (!soundSrc) return;

		const audio = new Audio(soundSrc);
		this.el.addEventListener("mouseenter", () => {
			audio.currentTime = 0;
			audio.play().catch(() => {});
		});
	}
}
