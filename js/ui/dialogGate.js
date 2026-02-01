// js/ui/dialogGate.js

// function initDialogGate() {
// 	const dialog = document.getElementById("interactionGate_id");
// 	const btn = document.getElementById("closeInteractionGate_id");

// 	if (!dialog || !btn) return;

// 	window.addEventListener("load", () => {
// 		dialog.showModal();
// 		btn.focus();
// 	});

// 	btn.addEventListener("click", () => {
// 		if (document.startViewTransition) {
// 			document.startViewTransition(() => dialog.close());
// 		} else {
// 			dialog.close();
// 		}
// 	});
// }
const dialog = document.createElement("dialog");
dialog.setAttribute("id", "interactionGate_id");
dialog.setAttribute("class", "interactionGate");
dialog.setAttribute("closedby", "none");

dialog.innerHTML = `
					<button
						id="closeInteractionGate_id"
						class="closeInteractionGate"
						autofocus
					>
						Enter
					</button>
`;
document.body.appendChild(dialog);
dialog.showModal();
