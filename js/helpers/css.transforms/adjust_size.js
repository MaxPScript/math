//
export function adjustSize(el, angle) {
	const resizeObserver = new ResizeObserver((entries) => {
		console.log(entries);
	});
	resizeObserver.observe(el);
	const originalHeight = el.offsetHeight;
	const angleInRad = Math.PI * (angle / 180);
	const apparentHeight = originalHeight * Math.cos(angleInRad);
	el.style.height = `${apparentHeight}px`;
}
