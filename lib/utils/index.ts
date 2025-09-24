export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const calculateThumbPosition = (
  value: number,
  min: number,
  max: number,
): number => {
  if (max - min === 0) return 0;
  return ((value - min) / (max - min)) * 100;
};

export const getClosestValue = (
  value: number,
  fixedValues: number[],
): number => {
  return fixedValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
  );
};

export const getStepValue = (
  currentValue: number,
  direction: "increase" | "decrease",
  fixedValues?: number[],
): number => {
  if (fixedValues) {
    const currentIndex = fixedValues.indexOf(currentValue);
    if (currentIndex === -1) {
      return fixedValues[0];
    }
    if (direction === "increase" && currentIndex < fixedValues.length - 1) {
      return fixedValues[currentIndex + 1];
    }
    if (direction === "decrease" && currentIndex > 0) {
      return fixedValues[currentIndex - 1];
    }
    return currentValue;
  }
  return direction === "increase" ? currentValue + 1 : currentValue - 1;
};
