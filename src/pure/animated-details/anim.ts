/**
 * Type keyframes builder.
 */
export type AnimFunc = (target: HTMLElement) => Keyframe[];

/**
 * Generates keyframes for a dynamic closing animation in JavaScript.
 *
 * @param target the html element to animate
 * @returns keyframes for the closing animation
 */
export const closingAnim: AnimFunc = (target) => [
  {
    height: target.offsetHeight + "px",
  },
  {
    height: 0,
  },
];

/**
 * Generates keyframes for a dynamic opening animation in JavaScript.
 *
 * @param target the html element to animate
 * @returns keyframes for the opening animation
 */
export const openingAnim: AnimFunc = (target) => [
  {
    height: 0,
  },
  {
    height: target.offsetHeight + "px",
  },
];

/**
 * Builds the animation options for a keyframe animation.
 *
 * CSS keyframe animations require both an animation-timing-function
 *
 * and an animation-duration to work correctly.
 *
 * This function extracts those values dynamically from the target element's styles.
 *
 * @param target The HTMLElement whose styles are used to determine animation options.
 * @returns An object containing the duration and easing options for the animation.
 */
export const getAnimOption = (target: HTMLElement) => {
  const style = getComputedStyle(target);
  const duration = parseFloat(style.animationDuration.slice(0, -1)) * 1000;
  const easing = style.animationTimingFunction;
  return { duration, easing };
};
