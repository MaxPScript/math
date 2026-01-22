class ImageColorAnalyzer {
	constructor(imagePath) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.img = new Image();
		this.img.crossOrigin = "Anonymous";
		this.img.src = imagePath;
		this.colorData = {};
	}

	analyzeColors() {
		return new Promise((resolve, reject) => {
			this.img.onload = () => {
				this.canvas.width = this.img.width;
				this.canvas.height = this.img.height;
				this.ctx.drawImage(this.img, 0, 0);

				const imageData = this.ctx.getImageData(
					0,
					0,
					this.canvas.width,
					this.canvas.height
				);
				// data here is an array with length = 1024*1536*4 = 6_291_456
				const data = imageData.data;
				// quantization - pixels with...
				for (let i = 0; i < data.length; i += 4) {
					const rQuantized = Math.floor(data[i] / 32);
					const gQuantized = Math.floor(data[i + 1] / 32);
					const bQuantized = Math.floor(data[i + 2] / 32);
					
					const r = rQuantized === 7 ? 255 : rQuantized * 32;
					const g = gQuantized === 7 ? 255 : gQuantized * 32;
					const b = bQuantized === 7 ? 255 : bQuantized * 32;
					
					const key = `rgb(${r},${g},${b})`;

					this.colorData[key] = (this.colorData[key] || 0) + 1;
				}

				resolve(this.getTopColors(20));
			};

			this.img.onerror = reject;
		});
	}

	getTopColors(limit) {
		console.log(Object.entries(this.colorData));
		console.log(Object.entries(this.colorData).length);
		
		const topColors = Object.entries(this.colorData)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([color, count]) => ({ color, count }));
		
		// Log CSS variables for easy copying
		console.log('=== CSS VARIABLES ===');
		topColors.slice(0, 8).forEach((item, index) => {
			const rgb = item.color.match(/\d+/g);
			const hex = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
			console.log(`--color-${index + 1}: ${hex}; /* ${item.color} - ${item.count.toLocaleString()} pixels */`);
		});
		
		return topColors;
	}

	createColorChart(colors, containerId) {
		const container = document.getElementById(containerId);
		if (!container) return;

		container.innerHTML = "";
		const chart = document.createElement("div");
		chart.style.cssText =
			"display: flex; flex-wrap: wrap; gap: 10px; padding: 20px;";

		const maxCount = Math.max(...colors.map((c) => c.count));

		colors.forEach(({ color, count }) => {
			const item = document.createElement("div");
			const percentage = (count / maxCount) * 100;

			item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                color: black;
            `;

			item.innerHTML = `
                <div style="width: 40px; height: 40px; background: ${color}; border-radius: 4px;"></div>
                <div style="font-size: 12px;">
                    <div>${color}</div>
                    <div>${count.toLocaleString()} pixels</div>
                    <div>${percentage.toFixed(1)}%</div>
                </div>
            `;

			chart.appendChild(item);
		});

		container.appendChild(chart);
	}

	generateDesignPalettes(colors) {
		const topColors = colors.slice(0, 10);
		const rgbToHex = (rgb) => {
			const match = rgb.match(/\d+/g);
			return (
				"#" +
				match.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
			);
		};

		const hexColors = topColors.map((c) => ({
			...c,
			hex: rgbToHex(c.color),
		}));

		return {
			vibrant: this.createVibrantPalette(hexColors),
			muted: this.createMutedPalette(hexColors),
			monochrome: this.createMonochromePalette(hexColors),
			complementary: this.createComplementaryPalette(hexColors),
		};
	}

	createVibrantPalette(colors) {
		const vibrant = colors.slice(0, 5);
		return {
			name: "Vibrant",
			description: "Bold, energetic colors from dominant image tones",
			colors: {
				primary: vibrant[0]?.hex || "#FF6B6B",
				secondary: vibrant[1]?.hex || "#4ECDC4",
				accent: vibrant[2]?.hex || "#45B7D1",
				highlight: vibrant[3]?.hex || "#FFA07A",
				background: vibrant[4]?.hex || "#F8F9FA",
			},
			usage: "Great for modern, energetic designs with strong visual hierarchy",
		};
	}

	createMutedPalette(colors) {
		const muted = colors.slice(0, 8).map((c) => this.muteColor(c.hex));
		return {
			name: "Muted",
			description: "Subtle, sophisticated tones with reduced saturation",
			colors: {
				primary: muted[0] || "#6C757D",
				secondary: muted[1] || "#868E96",
				accent: muted[2] || "#ADB5BD",
				highlight: muted[3] || "#CED4DA",
				background: muted[4] || "#F8F9FA",
			},
			usage:
				"Perfect for professional, elegant interfaces with calm aesthetics",
		};
	}

	createMonochromePalette(colors) {
		const baseColor = colors[0]?.hex || "#6C757D";
		return {
			name: "Monochrome",
			description: "Single color family with varying intensities",
			colors: {
				primary: baseColor,
				secondary: this.lightenColor(baseColor, 20),
				accent: this.lightenColor(baseColor, 40),
				highlight: this.lightenColor(baseColor, 60),
				background: this.lightenColor(baseColor, 80),
			},
			usage: "Ideal for minimalist, clean designs with strong consistency",
		};
	}

	createComplementaryPalette(colors) {
		const primary = colors[0]?.hex || "#6C757D";
		const complementary = this.getComplementaryColor(primary);
		return {
			name: "Complementary",
			description: "Balanced palette using opposite colors on color wheel",
			colors: {
				primary: primary,
				secondary: complementary,
				accent: this.lightenColor(primary, 30),
				highlight: this.lightenColor(complementary, 30),
				background: "#F8F9FA",
			},
			usage: "Creates visual contrast and dynamic, engaging interfaces",
		};
	}

	muteColor(hex) {
		const rgb = this.hexToRgb(hex);
		const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
		const muted = {
			r: Math.round(rgb.r * 0.7 + gray * 0.3),
			g: Math.round(rgb.g * 0.7 + gray * 0.3),
			b: Math.round(rgb.b * 0.7 + gray * 0.3),
		};
		return this.rgbToHex(muted.r, muted.g, muted.b);
	}

	lightenColor(hex, percent) {
		const rgb = this.hexToRgb(hex);
		const lightened = {
			r: Math.min(255, Math.round(rgb.r + ((255 - rgb.r) * percent) / 100)),
			g: Math.min(255, Math.round(rgb.g + ((255 - rgb.g) * percent) / 100)),
			b: Math.min(255, Math.round(rgb.b + ((255 - rgb.b) * percent) / 100)),
		};
		return this.rgbToHex(lightened.r, lightened.g, lightened.b);
	}

	getComplementaryColor(hex) {
		const rgb = this.hexToRgb(hex);
		const comp = {
			r: 255 - rgb.r,
			g: 255 - rgb.g,
			b: 255 - rgb.b,
		};
		return this.rgbToHex(comp.r, comp.g, comp.b);
	}

	hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	generateCSSVariables(colors, palettes) {
		// Generate CSS variables from ALL palettes
		let cssContent = `:root {
	/* ========================================
	   PALETTE-BASED COLOR SYSTEM
	   ======================================== */`;
		
		// Add each palette as a section
		Object.entries(palettes).forEach(([paletteName, palette]) => {
			cssContent += `

	/* ${paletteName.toUpperCase()} PALETTE */
	--${paletteName}-primary: ${palette.colors.primary};
	--${paletteName}-secondary: ${palette.colors.secondary};
	--${paletteName}-accent: ${palette.colors.accent};
	--${paletteName}-highlight: ${palette.colors.highlight};
	--${paletteName}-background: ${palette.colors.background};`;
		});
		
		// Add default semantic variables (using vibrant)
		cssContent += `

	/* DEFAULT SEMANTIC COLORS (using vibrant palette) */
	--primary: var(--vibrant-primary);
	--secondary: var(--vibrant-secondary);
	--accent: var(--vibrant-accent);
	--highlight: var(--vibrant-highlight);
	--background: var(--vibrant-background);
	--surface: var(--background);
	--border: var(--highlight);
	--text-primary: var(--primary);
	--text-secondary: var(--secondary);
	--text-muted: var(--highlight);
	
	/* ========================================
	   LEGACY COLORS (COMMENTED)
	   ======================================== */
	/*
	--sandy-brown: hsla(31, 100%, 64%, 1);
	--reddish-brown: hsla(11, 52%, 43%, 1);
	--reddish-brown-opposite: hsl(
		from var(--reddish-brown) calc(h + 180) s l / 1
	);
	--reddish-brown-opposite-darker: hsl(
		from var(--reddish-brown) calc(h + 180) s calc(l - 30) / 1
	);
	--reddish-brown-opposite-lighter: hsl(
		from var(--reddish-brown) calc(h + 180) s calc(l + 30) / 1
	);
	--orange: hsla(36, 100%, 60%, 1);
	--chocolate: hsla(26, 75%, 51%, 1);
	--sandy-brown-2: hsla(28, 84%, 61%, 1);
	*/
}`;
		
		console.log('=== GENERATED CSS FROM ALL PALETTES ===');
		console.log(cssContent);
		console.log('=== COPY THIS TO colors.css ===');
		
		return cssContent;
	}

	displayPalettes(palettes, containerId) {
		if (!container) return;

		container.innerHTML = "<h3>Design System Palettes</h3>";

		Object.values(palettes).forEach((palette) => {
			const paletteDiv = document.createElement("div");
			paletteDiv.style.cssText = `
                margin: 20px 0;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: white;
            `;

			const colorsHtml = Object.entries(palette.colors)
				.map(
					([name, color]) => `
                    <div style="
                        display: flex;
                        align-items: center;
                        margin: 8px 0;
                        padding: 8px;
                        background: #f8f9fa;
                        border-radius: 4px;
                    ">
                        <div style="
                            width: 50px;
                            height: 30px;
                            background: ${color};
                            border-radius: 4px;
                            margin-right: 12px;
                            border: 1px solid #ddd;
                        "></div>
                        <div style="flex: 1; color: black;">
                            <strong>${
															name.charAt(0).toUpperCase() + name.slice(1)
														}:</strong> ${color}
                        </div>
                    </div>
                `
				)
				.join("");

			paletteDiv.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #333;">${palette.name}</h4>
                <p style="margin: 0 0 15px 0; color: #666; font-style: italic;">${palette.description}</p>
                <div>${colorsHtml}</div>
                <p style="margin: 15px 0 0 0; color: #495057; font-size: 14px;">
                    <strong>Usage:</strong> ${palette.usage}
                </p>
            `;

			container.appendChild(paletteDiv);
		});
	}
}

const analyzer = new ImageColorAnalyzer("../../../assets/img/bg_2.webp");

analyzer
	.analyzeColors()
	.then((colors) => {
		console.log("Top colors:", colors);
		analyzer.createColorChart(colors, "color-chart-container");
		
		// Generate and display design palettes
		const palettes = analyzer.generateDesignPalettes(colors);
		analyzer.displayPalettes(palettes, "palette-container");
		
		// Generate CSS variables from palette colors
		analyzer.generateCSSVariables(colors, palettes);
		
		// Also log palettes to console for easy copying
		console.log("Design Palettes:", palettes);
	})
	.catch(console.error);
