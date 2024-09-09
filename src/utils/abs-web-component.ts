/**
 * Options for setting up the shadow DOM in a Web Component.
 *
 * - `htmlString`: A raw HTML string that represents the component's template.
 * - `style`: A string containing the component's CSS styles.
 * - `shadowMode`: Determines whether the shadow DOM is open or closed.
 *                If "open", external scripts can access the shadow DOM via CSS.
 */
export interface Option {
  htmlString: string;
  style: string;
  shadowMode: "open" | "closed";
}

/**
 * Abstract base class for creating Web Components with a shadow DOM.
 *
 * This class sets up the component's shadow DOM using the provided template
 *
 * and style, and attaches it based on the specified shadow mode.
 *
 * If you need to access the shadow DOM in your component's methods,
 *
 * you can use `this.shadowRoot`.
 */
export abstract class AbsWebComponent extends HTMLElement {
  constructor({ htmlString, style, shadowMode }: Option) {
    super();
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    const styleEl = document.createElement("style");
    styleEl.innerHTML = style;
    template.content.appendChild(styleEl);
    const shadow = this.attachShadow({ mode: shadowMode });
    shadow.appendChild(template.content.cloneNode(true));
  }
}
