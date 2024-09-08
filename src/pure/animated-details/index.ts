import htmlString from "./index.html?raw";
import style from "./main.css?inline";
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
import { AbsWebComponent } from "src/utils/abs-web-component";

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

type LiveStates = Pick<States, "details" | "internal">;

class AnimatedDetails extends AbsWebComponent {
  private states!: LiveStates;
  constructor() {
    super({ htmlString, style, shadowMode: "open" });
  }
  connectedCallback() {
    const shadow = this.shadowRoot!;
    const internal = this.attachInternals();

    const detailElement = shadow.querySelector("details")!;
    const slotElement = detailElement.children[1] as HTMLSlotElement;

    const openKeyframe = this.dataset.openKeyframe!;
    const closeKeyframe = this.dataset.closeKeyframe!;
    const target = slotElement.assignedElements()[0] as HTMLElement;

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
      details: new DetailsState(detailElement),
      internal: new InternalSingleState("open", internal),
    };

    register4State(this, states);

    this.states = {
      details: states.details,
      internal: states.internal,
    };
  }

  static get observedAttributes() {
    return ["data-open"];
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "data-open":
        if (newValue != null) {
          console.log("hey!");
          this.states.details.turnOn();
          this.states.internal.turnOn();
        } else {
          this.states.details.turnOff();
          this.states.internal.turnOff();
        }
    }
  }
}

customElements.define("pure-animated-details", AnimatedDetails);
