import htmlString from "./index.html?raw";
import style from "./main.css?inline";
import {
  InternalSingleState,
  CssAnimVariableState,
  DetailsState,
  AnimState,
} from "./state";
import { AbsWebComponent } from "src/utils/abs-web-component";

interface States {
  internal: InternalSingleState;
  cssVariable: CssAnimVariableState;
  details: DetailsState;
  anim: AnimState;
}

type EventNames = "openstart" | "openend" | "closestart" | "closeend";

/**
 * Proxies the click event on the details element to dispatch
 * custom events on the root Web Component.
 *
 * When the details element is clicked, it checks if the element is open
 * and dispatches either the "openstart" or "closestart" event accordingly.
 *
 * @param eventTarget The root Web Component instance.
 * @param details The `DetailsState` instance associated with the details element.
 */
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

/**
 * Proxies the animation events to dispatch custom events
 * on the root Web Component.
 *
 * These events are triggered when the animation completes
 * ("finishturnon" and "finishturnoff") and dispatch "openend" or "closeend".
 *
 * @param eventTarget The root Web Component instance.
 * @param anim The `AnimState` instance managing the animations.
 */
const proxyAnimEvent = (eventTarget: AnimatedDetails, anim: AnimState) => {
  anim.addEventListener("finishturnon", () => {
    eventTarget.dispatchEvent(new Event("openend"));
  });
  anim.addEventListener("finishturnoff", () => {
    eventTarget.dispatchEvent(new Event("closeend"));
  });
};

/**
 * Registers event listeners for the gathered events,
 * linking them to the state changes (turning on/off).
 *
 * Based on the events dispatched (openstart, closestart, etc.),
 * this function updates the relevant states (details, animation, CSS variable, internal).
 *
 * @param eventTarget The root Web Component instance.
 * @param states All state instances used for managing the component's behavior.
 */
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

/**
 * it is required in some instance method.
 * so this is state which should be instance's member variable.
 */
type LiveStates = Pick<States, "details" | "internal">;

/**
 * Details element with vertical animation.
 * you can inject the additional animation by passing keyframe's name.
 *
 * ## Attributes
 *
 * - data-open-keyframe(string): the opening animation's keyframe name. this does not react.
 * - data-close-keyframe(string): the closing animation's keyframe name. this does not react.
 * - data-open(bool): decide which the details should open.
 *
 * ## Events
 *
 * - openstart: on just fire open event
 * - openend: after end opening animation
 * - closestart: on just fire close event
 * - closeend: after end closing animation
 *
 */
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
