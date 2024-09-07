import { AbsSingleFlgState } from "./abs-state";
import { closingAnim, getAnimOption, openingAnim } from "./anim";
import type { AnimFunc } from "./anim";

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

export class DetailsState extends AbsSingleFlgState {
  constructor(public readonly detailEl: HTMLDetailsElement) {
    super();
  }
  turnOn(): void {
    this.detailEl.setAttribute("open", "");
  }
  turnOff(): void {
    this.detailEl.removeAttribute("open");
  }
  isOpen() {
    return this.detailEl.getAttribute("open") != null;
  }
}

export type AnimStateEventNames = "finishturnon" | "finishturnoff";

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
