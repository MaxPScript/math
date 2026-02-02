//
const btns = document.querySelectorAll("[data-interactive]");
console.log(btns);
btns.forEach((_) => {
	const className = _.className;
	// console.log(className);
	// _.setAttribute("aria-label", `${className}`);
});
