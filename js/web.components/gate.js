class InteractionGate extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
            <style>
                dialog[open] {
                    width: 100vw;
                    height: 100vh;
                    // max-width: unset;
                    // max-height: unset;
                    border: none;
                    // background-size: 50%;
                    // background-position: center;
                    // background-repeat: no-repeat;
                    background-color: hsl(0 0 0 / 0);
                    display: grid;
                    align-content: center;
                    grid-template-columns: 1fr 50% 1fr;
                        button {
                            background-image: url(./assets/img/gate.webp);
                            background-size: cover;
                            grid-column: 2/3;
                            aspect-ratio: 1129/617;
                            transition: all 0.2s;
                        }
                        button:hover {
                            cursor: pointer;
                            transform: translateY(-2px);
                            filter: brightness(1.2);
                        }
                            button:focus-visible {
                        }
                }
                dialog::backdrop {
                    background-color: hsl(0 50 0 / 0.5);
                    backdrop-filter: blur(2px);
                }
            </style>
            <dialog>
				<button autofocus><span>Enter</span></button>
            </dialog>
            `;
	}
	connectedCallback() {
		this.dialog = this.shadowRoot.querySelector("dialog");
		this.button = this.shadowRoot.querySelector("button");
		this.buttonText = this.shadowRoot.querySelector("button span");

		if (!this.dialog.open) {
			this.dialog.showModal();
			this.showLoading("WAIT");
		}

		this.button.addEventListener("click", () => {
			this.close();
		});
	}
	showLoading(text) {
		this.buttonText.textContent = text;
		this.button.disabled = true;
	}

	unlock() {
		this.button.disabled = false;
		this.button.focus();
		this.buttonText.textContent = "Enter";
	}
	close() {
		this.dialog.close();
		this.remove();
	}
}
customElements.define("interaction-gate", InteractionGate);
