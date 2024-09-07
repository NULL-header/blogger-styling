export type AnimFunc = (target: HTMLElement) => Keyframe[];

export const closingAnim: AnimFunc = (target) => [
  {
    height: target.offsetHeight + "px",
  },
  {
    height: 0,
  },
];

export const openingAnim: AnimFunc = (target) => [
  {
    height: 0,
  },
  {
    height: target.offsetHeight + "px",
  },
];

export const getAnimOption = (target: HTMLElement) => {
  const style = getComputedStyle(target);
  const duration = parseFloat(style.animationDuration.slice(0, -1)) * 1000;
  const easing = style.animationTimingFunction;
  return { duration, easing };
};
