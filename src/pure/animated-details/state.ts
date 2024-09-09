import { AbsSingleFlgState } from "./abs-state";
import { closingAnim, getAnimOption, openingAnim } from "./anim";
import type { AnimFunc } from "./anim";

/**
 * Manages the internal state of a Web Component's ElementInternals.
 *
 * This class interacts with the internal `states` of the Web Component
 * to turn on or off a specific state by name.
 */
export class InternalSingleState extends AbsSingleFlgState {
  constructor(
    private readonly stateName: string,
    private readonly internalStatus: ElementInternals
  ) {
    super();
  }
  turnOn() {
    this.internalStatus.states.add(this.stateName);
  }
  turnOff() {
    this.internalStatus.states.delete(this.stateName);
  }
}

/**
 * Injects the CSS variable "--animation-name" to control animations.
 *
 * ## Note
 *
 * turn**On** -> fire **open**Keyframe
 *
 * turn**Off** -> fire **close**Keyframe
 *
 */
export class CssAnimVariableState extends AbsSingleFlgState {
  constructor(
    private readonly closeKeyframe: string,
    private readonly openKeyframe: string,
    private readonly target: HTMLElement
  ) {
    super();
  }

  turnOn() {
    this.target.style.setProperty("--animation-name", this.openKeyframe);
  }
  turnOff() {
    this.target.style.setProperty("--animation-name", this.closeKeyframe);
  }
}

/**
 * Manages the "open" attribute of the passed HTMLDetailsElement.
 */
export class DetailsState extends AbsSingleFlgState {
  constructor(public readonly detailEl: HTMLDetailsElement) {
    super();
  }
  turnOn(): void {
    this.detailEl.setAttribute("open", "");
  }
  /**
   * When this is called, any ongoing animation will be skipped.
   */
  turnOff(): void {
    this.detailEl.removeAttribute("open");
  }
  isOpen() {
    return this.detailEl.getAttribute("open") != null;
  }
}

export type AnimStateEventNames = "finishturnon" | "finishturnoff";

/**
 * Manages the state of animations, typically vertical animations.
 *
 * The keyframes for this animation are defined in `./anim.ts`.
 *
 * ## Events
 * - `finishturnon`: Triggered when the opening animation finishes.
 * - `finishturnoff`: Triggered when the closing animation finishes.
 *
 * These events can be used for additional side effects upon
 *
 * the completion of animations.
 *
 * the event is used for attribute state of details
 *
 * because the native logic at "open" attribute stops this animation.
 */
export class AnimState extends AbsSingleFlgState {
  private readonly eventer: EventTarget;
  constructor(private readonly targetEl: HTMLElement) {
    super();
    this.eventer = new EventTarget();
  }
  private turn(func: AnimFunc, event: AnimStateEventNames) {
    const target = this.targetEl;
    const option = getAnimOption(target);
    const animating = target.animate(func(target), option);
    animating.addEventListener("finish", () => {
      this.eventer.dispatchEvent(new Event(event));
    });
  }

  turnOff(): void {
    this.turn(closingAnim, "finishturnoff");
  }
  turnOn(): void {
    this.turn(openingAnim, "finishturnon");
  }

  addEventListener(eventName: AnimStateEventNames, callback: () => void) {
    this.eventer.addEventListener(eventName, callback);
  }
}
