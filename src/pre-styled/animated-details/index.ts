import htmlString from "./index.html?raw";
import style from "./main.css?inline";
import "@/pure_animated-details.js";
import { AbsWebComponent } from "src/utils/abs-web-component";

/**
 * A wrapper component for pre-styled animations.
 * This extends the functionality of the `pure-animated-details` component
 * by injecting additional animations and SVG elements.
 *
 * ## Attributes
 *
 * - data-title (string): Sets the content of the title container element.
 * - data-open (bool): Determines if the details element should be open on load.
 */
class AnimatedDetails extends AbsWebComponent {
  constructor() {
    super({ htmlString, style, shadowMode: "open" });
  }

  connectedCallback() {
    const summary = this.shadowRoot!.querySelector(
      "*[data-title]"
    ) as HTMLElement;
    const title = this.dataset.title;
    if (title == null) return;
    summary.innerHTML = title;
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
