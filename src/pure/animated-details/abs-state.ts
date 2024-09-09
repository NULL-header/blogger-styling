/**
 * This abstract class provides methods for managing a single flag state.
 *
 * No logic is implemented here, it is meant to be extended by concrete classes.
 */
export abstract class AbsSingleFlgState {
  /**
   * Turns on the flag. This method is not a toggle, so the flag will remain on
   *
   * even if it's already on when this method is called.
   */
  abstract turnOn(): void;
  /**
   * Turns off the flag. This method is not a toggle, so the flag will remain off
   *
   * even if it's already off when this method is called.
   */
  abstract turnOff(): void;
}
