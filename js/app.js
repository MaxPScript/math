// export function adjustSize(el, angle)
import { adjustSize } from "./helpers/css.transforms/adjust_size.js";
// const el = document.getElementById("intro_p1_id");
// adjustSize(el, 80);
//
class PythagoreanTheoremApp {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		if (!this.canvas) {
			throw new Error(`Canvas element with id '${canvasId}' not found`);
		}

		this.ctx = this.canvas.getContext("2d");
		this.POINT_RADIUS = 6;
		this.DRAG_THRESHOLD = this.POINT_RADIUS * 2;

		this.origin = { x: 100, y: 220 };
		this.pointA = { x: 260, y: 220 };
		this.pointB = { x: 100, y: 80 };
		this.draggingPoint = null;
		this.hoveredPoint = null;

		this.colors = {
			origin: "#000",
			pointA: "#1a73e8",
			pointB: "#e8711a",
			triangle: "#222",
			text: "#000",
			hover: "#ff6b6b",
		};

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupCanvas();
		this.draw();
	}

	setupCanvas() {
		const resizeCanvas = () => {
			const rect = this.canvas.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			this.canvas.width = rect.width * dpr;
			this.canvas.height = rect.height * dpr;
			this.ctx.scale(dpr, dpr);

			this.canvas.style.width = rect.width + "px";
			this.canvas.style.height = rect.height + "px";

			this.draw();
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
	}

	setupEventListeners() {
		this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.canvas.addEventListener(
			"mouseleave",
			this.handleMouseLeave.bind(this)
		);

		this.canvas.style.cursor = "grab";
	}

	getMousePos(event) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	distance(p1, p2) {
		return Math.hypot(p1.x - p2.x, p1.y - p2.y);
	}

	isPointHit(point, mouse) {
		return this.distance(point, mouse) < this.DRAG_THRESHOLD;
	}

	handleMouseDown(event) {
		const mouse = this.getMousePos(event);

		if (this.isPointHit(this.pointA, mouse)) {
			this.draggingPoint = this.pointA;
			this.canvas.style.cursor = "grabbing";
		} else if (this.isPointHit(this.pointB, mouse)) {
			this.draggingPoint = this.pointB;
			this.canvas.style.cursor = "grabbing";
		}
	}

	handleMouseMove(event) {
		const mouse = this.getMousePos(event);

		if (this.draggingPoint) {
			this.updateDraggingPoint(mouse);
			this.draw();
		} else {
			this.updateHoverState(mouse);
		}
	}

	updateDraggingPoint(mouse) {
		if (this.draggingPoint === this.pointA) {
			this.pointA.x = Math.max(this.origin.x + 20, mouse.x);
			this.pointA.y = this.origin.y;
		} else if (this.draggingPoint === this.pointB) {
			this.pointB.x = this.origin.x;
			this.pointB.y = Math.max(20, Math.min(this.origin.y - 20, mouse.y));
		}
	}

	updateHoverState(mouse) {
		const previousHovered = this.hoveredPoint;
		this.hoveredPoint = null;

		if (this.isPointHit(this.pointA, mouse)) {
			this.hoveredPoint = this.pointA;
			this.canvas.style.cursor = "grab";
		} else if (this.isPointHit(this.pointB, mouse)) {
			this.hoveredPoint = this.pointB;
			this.canvas.style.cursor = "grab";
		} else {
			this.canvas.style.cursor = "default";
		}

		if (previousHovered !== this.hoveredPoint) {
			this.draw();
		}
	}

	handleMouseUp() {
		this.draggingPoint = null;
		this.canvas.style.cursor = "grab";
	}

	handleMouseLeave() {
		this.draggingPoint = null;
		this.hoveredPoint = null;
		this.canvas.style.cursor = "default";
		this.draw();
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawTriangle();
		this.drawRightAngleIndicator();
		this.drawPoints();
		this.drawLabels();
		this.drawMeasurements();
	}

	drawTriangle() {
		this.ctx.strokeStyle = this.colors.triangle;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(this.origin.x, this.origin.y);
		this.ctx.lineTo(this.pointA.x, this.pointA.y);
		this.ctx.lineTo(this.pointB.x, this.pointB.y);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawRightAngleIndicator() {
		const squareSize = 15;
		this.ctx.strokeStyle = this.colors.triangle;
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(this.origin.x + squareSize, this.origin.y);
		this.ctx.lineTo(this.origin.x + squareSize, this.origin.y - squareSize);
		this.ctx.lineTo(this.origin.x, this.origin.y - squareSize);
		this.ctx.stroke();
	}

	drawPoints() {
		this.drawPoint(this.origin, this.colors.origin);
		this.drawPoint(this.pointA, this.colors.pointA);
		this.drawPoint(this.pointB, this.colors.pointB);
	}

	drawPoint(point, color) {
		const isHovered = point === this.hoveredPoint;
		const isDragging = point === this.draggingPoint;
		const radius = isDragging ? this.POINT_RADIUS + 2 : this.POINT_RADIUS;

		this.ctx.fillStyle = isHovered ? this.colors.hover : color;
		this.ctx.beginPath();
		this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
		this.ctx.fill();

		if (isDragging) {
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = 2;
			this.ctx.stroke();
		}
	}

	drawLabels() {
		this.ctx.fillStyle = this.colors.text;
		this.ctx.font = "bold 14px system-ui";

		this.ctx.fillText(
			"a",
			(this.origin.x + this.pointA.x) / 2,
			this.origin.y + 14
		);
		this.ctx.fillText(
			"b",
			this.origin.x - 18,
			(this.origin.y + this.pointB.y) / 2
		);
		this.ctx.fillText(
			"c",
			(this.pointA.x + this.pointB.x) / 2 + 6,
			(this.pointA.y + this.pointB.y) / 2
		);
	}

	drawMeasurements() {
		const a = this.distance(this.origin, this.pointA);
		const b = this.distance(this.origin, this.pointB);
		const c = this.distance(this.pointA, this.pointB);

		this.ctx.fillStyle = "#666";
		this.ctx.font = "12px system-ui";

		this.ctx.fillText(
			`a = ${a.toFixed(1)}`,
			this.origin.x + 10,
			this.origin.y - 10
		);
		this.ctx.fillText(
			`b = ${b.toFixed(1)}`,
			this.origin.x - 40,
			this.origin.y - 40
		);
		this.ctx.fillText(
			`c = ${c.toFixed(1)}`,
			this.pointA.x + 10,
			this.pointA.y - 10
		);

		const aSquared = a * a;
		const bSquared = b * b;
		const cSquared = c * c;
		const isValid = Math.abs(aSquared + bSquared - cSquared) < 0.1;

		this.ctx.fillStyle = isValid ? "#0f9d58" : "#ea4335";
		this.ctx.font = "bold 14px system-ui";
		this.ctx.fillText(`a² + b² = c² ${isValid ? "✓" : "✗"}`, 10, 30);
	}

	getTriangleData() {
		return {
			a: this.distance(this.origin, this.pointA),
			b: this.distance(this.origin, this.pointB),
			c: this.distance(this.pointA, this.pointB),
			points: {
				origin: { ...this.origin },
				pointA: { ...this.pointA },
				pointB: { ...this.pointB },
			},
		};
	}
}

const app = new PythagoreanTheoremApp("pythagorasCanvas");

window.pythagoreanApp = app;
