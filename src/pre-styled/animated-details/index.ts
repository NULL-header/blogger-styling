import HTMLString from "./index.html?raw";
import styles from "./main.css?inline";
import "@/pure_animated-details.js";

class AnimatedDetails extends HTMLElement {
  private summary: HTMLElement;
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = HTMLString;
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    template.content.appendChild(styleEl);
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    const summary = shadow.querySelector("*[data-title]") as HTMLElement;
    this.summary = summary;
  }

  connectedCallback() {
    const title = this.dataset.title;
    if (title == null) return;
    this.summary.innerHTML = title;
    const initialOpen = this.dataset.open;
    if (initialOpen != null) {
      const animatedDetails = this.shadowRoot!.querySelector(
        "pure-animated-details"
      ) as HTMLElement;
      animatedDetails.dataset.open = initialOpen;
    }
  }
}

customElements.define("pre-styled-animated-details", AnimatedDetails);
