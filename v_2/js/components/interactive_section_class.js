/*
    SOURCE IMAGE (file)
        │
        ▼
    [ Background Element ]
        │   (background-image)
        │
        │  ┌───────────────┐
        │  │   sub-region  │  ← extracted area
        │  └───────────────┘
        │
        ▼
    [ Overlay Element ]
        │   (background-image = cut-out (sub-region))
        │
        ▼
    Result:
    The overlay element is positioned so the extracted image
    region aligns perfectly on top of the original background.

    Purpose:
    This is an intentional design technique used to create
    layered and interactive visual regions from a single image.
*/
/**
 * This script uses a source image that is already applied as the
 * background of an element on the page.
 *
 * A specified rectangular region is extracted from the source image
 * and applied as the background of a separate overlay element.
 *
 * The overlay element is then positioned so that the extracted region
 * aligns precisely over the corresponding area of the original
 * background image.
 *
 * This is an intentional design technique used to create layered,
 * interactive visual effects from a single source image.
 */

class InteractiveSection {
	constructor(el) {
		this.el = el;
		this.refSelector = el.dataset.ref || "#papyrus_id";
		this.refElement = document.querySelector(this.refSelector);
		if (!this.refElement) {
			console.warn("Papyrus reference not found!", this.refSelector);
			return;
		}
		this.init();
	}
	//
	init() {
		this.readAttributes();
		this.computeLayout();
		this.observeResize();
		this.attachAudio();
	}
	//
	readAttributes() {
		const d = this.el.dataset;
		// console.log(d);
		this.srcImg = d.srcImg;
		this.srcImgWidth = +d.srcImgWidth;
		this.srcImgHeight = +d.srcImgHeight;
		this.cutX = +d.cutX;
		this.cutY = +d.cutY;
		this.cutW = +d.cutW;
		this.cutH = +d.cutH;
	}
	//
	computeLayout() {
		this.srcImgRender = {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
		};
		const refElementRect = this.refElement.getBoundingClientRect();
		console.log(refElementRect);
		const cutNormCoords = {
			x: this.cutX / this.srcImgWidth,
			y: this.cutY / this.srcImgHeight,
			w: this.cutW / this.srcImgWidth,
			h: this.cutH / this.srcImgHeight,
		};
		(() => {
			const refElementRatio = refElementRect.width / refElementRect.height;
			const srcImageRatio = this.srcImgWidth / this.srcImgHeight;
			if (refElementRatio > srcImageRatio) {
				this.srcImgRender.h = refElementRect.height;
				this.srcImgRender.w = this.srcImgRender.h * srcImageRatio;
				this.srcImgRender.x = (refElementRect.width - this.srcImgRender.w) / 2;
			} else if (refElementRatio < srcImageRatio) {
				this.srcImgRender.w = refElementRect.width;
				this.srcImgRender.h = this.srcImgRender.w / srcImageRatio;
				this.srcImgRender.y = (refElementRect.height - this.srcImgRender.h) / 2;
			} else {
				this.srcImgRender.w = refElementRect.width;
				this.srcImgRender.h = refElementRect.height;
			}
		})();
		console.log(this.srcImgRender);
		//
		console.log(cutNormCoords.x, this.srcImgRender.w, this.srcImgRender.x);
		this.el.style.left = `${cutNormCoords.x * this.srcImgRender.w + this.srcImgRender.x}px`;
		this.el.style.top = `${cutNormCoords.y * this.srcImgRender.h + this.srcImgRender.y}px`;
		this.el.style.width = `${cutNormCoords.w * this.srcImgRender.w}px`;
		this.el.style.height = `${cutNormCoords.h * this.srcImgRender.h}px`;
		this.renderBackground();
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
	//
	async renderBackground() {
		if (!this.srcImg) return;

		// const img = new Image();
		const img = await this.loadImage();
		// img.src = this.srcImg;
		// await img.decode();
		const canvas = document.createElement("canvas");
		canvas.width = this.cutW;
		canvas.height = this.cutH;
		const ctx = canvas.getContext("2d");
		// ctx.drawImage(img, this.x, this.y, this.w, this.h, 0, 0, this.y, this.w);
		// ctx.drawImage(img, 0, 0);
		ctx.drawImage(
			img,
			this.cutX,
			this.cutY,
			this.cutW,
			this.cutH, // source cut
			0,
			0,
			this.cutW,
			this.cutH, // target
		);
		this.el.style.backgroundImage = `url(${canvas.toDataURL("image/webp")})`;
		this.el.style.backgroundSize = "cover";
	}
	//
	observeResize() {
		// this.ro = new ResizeObserver(() => this.computeLayout());
		// this.ro.observe(this.refEl);
	}

	//
	attachAudio() {
		const soundSrc = this.el.dataset.sound;
		if (!soundSrc) return;
		const audio = new Audio(soundSrc);
		this.el.addEventListener("mouseenter", () => {
			audio.currentTime = 0;
			audio.play().catch(() => {});
		});
	}
	//
	destroy() {
		// this.ro?.disconnect();
	}
}
//
document
	.querySelectorAll("[data-interactive]")
	.forEach((el) => new InteractiveSection(el));
// DIALOG
const dialog = document.getElementById("interactionGate_id");
const btnClose = document.getElementById("closeInteractionGate_id");
window.addEventListener("load", () => {
	dialog.showModal();
	btnClose.focus();
});
btnClose.addEventListener("click", (ev) => {
	if (document.startViewTransition) {
		document.startViewTransition(() => {
			dialog.close();
		});
	} else {
		dialog.close();
	}
});
