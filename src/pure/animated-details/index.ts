import HTMLString from "./index.html?raw";
import {
  InternalSingleState,
  CssAnimVariableState,
  DetailsState,
  AnimState,
} from "./state";

interface States {
  internal: InternalSingleState;
  cssVariable: CssAnimVariableState;
  details: DetailsState;
  anim: AnimState;
}

type EventNames = "openstart" | "openend" | "closestart" | "closeend";

const proxyDetailEvent = (
  eventTarget: AnimatedDetails,
  details: DetailsState
) => {
  details.detailEl.addEventListener("click", (e) => {
    e.preventDefault();
    if (details.isOpen()) {
      eventTarget.dispatchEvent(new Event("closestart"));
      return;
    }
    eventTarget.dispatchEvent(new Event("openstart"));
  });
};

const proxyAnimEvent = (eventTarget: AnimatedDetails, anim: AnimState) => {
  anim.addEventListener("finishturnon", () => {
    eventTarget.dispatchEvent(new Event("openend"));
  });
  anim.addEventListener("finishturnoff", () => {
    eventTarget.dispatchEvent(new Event("closeend"));
  });
};

const register4State = (eventTarget: AnimatedDetails, states: States) => {
  proxyDetailEvent(eventTarget, states.details);
  proxyAnimEvent(eventTarget, states.anim);
  const addListener = (eventNames: EventNames, callback: () => void) => {
    eventTarget.addEventListener(eventNames, callback);
  };

  addListener("openstart", () => {
    states.details.turnOn();
    states.cssVariable.turnOn();
    states.anim.turnOn();
    states.internal.turnOn();
  });

  addListener("closestart", () => {
    states.cssVariable.turnOff();
    states.anim.turnOff();
    states.internal.turnOff();
  });
  addListener("closeend", () => {
    states.details.turnOff();
  });
};

class AnimatedDetails extends HTMLElement {
  private readonly detailElement: HTMLDetailsElement;
  private readonly slotElement: HTMLSlotElement;
  private readonly internal: ElementInternals;
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = HTMLString;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    this.internal = this.attachInternals();

    const detailElement = shadow.querySelector("details")!;
    const slotElement = detailElement.children[1];
    this.detailElement = detailElement;
    this.slotElement = slotElement as HTMLSlotElement;
  }
  connectedCallback() {
    const openKeyframe = this.dataset.openKeyframe!;
    const closeKeyframe = this.dataset.closeKeyframe!;
    const target = this.slotElement.assignedElements()[0] as HTMLElement;

    if ([openKeyframe, closeKeyframe, target].every((e) => e == null)) {
      return;
    }
    const states: States = {
      anim: new AnimState(target),
      cssVariable: new CssAnimVariableState(
        closeKeyframe,
        openKeyframe,
        target
      ),
      details: new DetailsState(this.detailElement),
      internal: new InternalSingleState("open", this.internal),
    };

    register4State(this, states);
  }
}
customElements.define("animated-details", AnimatedDetails);
