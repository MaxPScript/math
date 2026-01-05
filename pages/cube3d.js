import "./web_components/index.js";
//
const faces = document.querySelectorAll("[data-name]");
console.log(faces);
faces.forEach((el, i) => {
	el.style.background = `hsl(${i * 60} 50 50 / 1)`;
});
// show-bottom
const radioButtons = document.querySelectorAll("[type='radio']");
console.log(radioButtons);
//
const fieldset = document.querySelector("fieldset");
const box = document.querySelector(".box");
fieldset.addEventListener("change", function (ev) {
	console.log(ev.target.dataset);
	console.log(box.classList);
	box.classList = "";
	box.classList.add("box", ev.target.dataset.name);

	// let className = ev.target.dataset.name;
	// if (!box.classList.contains(className)) {
	// 	box.classList.add(`${ev.target.dataset.name}`);
	// }
	// box.classList.replace()
});
//
