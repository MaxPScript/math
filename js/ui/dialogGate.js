// js/ui/dialogGate.js

export function initDialogGate() {
	const dialog = document.getElementById("interactionGate_id");
	const btn = document.getElementById("closeInteractionGate_id");

	if (!dialog || !btn) return;

	window.addEventListener("load", () => {
		dialog.showModal();
		btn.focus();
	});

	btn.addEventListener("click", () => {
		if (document.startViewTransition) {
			document.startViewTransition(() => dialog.close());
		} else {
			dialog.close();
		}
	});
}
