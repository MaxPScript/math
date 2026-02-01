// js/app.js

import { InteractiveSection } from "./components/interactive_section_class.js";
// import { initDialogGate } from "./ui/dialogGate.js";

document
	.querySelectorAll("[data-interactive]")
	.forEach((el) => new InteractiveSection(el));

// initDialogGate();
