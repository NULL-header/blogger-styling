export interface Option {
  htmlString: string;
  style: string;
  shadowMode: "open" | "closed";
}

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
