import { describe, it, expect } from "vitest";
import {
  clamp,
  calculateThumbPosition,
  getClosestValue,
  getStepValue,
} from ".";

describe("clamp", () => {
  it("should return the value if it is within the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("should return the minimum value if the value is less than the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("should return the maximum value if the value is greater than the maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("should handle the case where min and max are equal", () => {
    expect(clamp(10, 5, 5)).toBe(5);
    expect(clamp(0, 5, 5)).toBe(5);
  });

  it("should return the value if it is equal to the min or max", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("calculateThumbPosition", () => {
  it("should return 50 for a value in the middle of the range", () => {
    expect(calculateThumbPosition(50, 0, 100)).toBe(50);
  });

  it("should return 0 for the minimum value", () => {
    expect(calculateThumbPosition(0, 0, 100)).toBe(0);
  });

  it("should return 100 for the maximum value", () => {
    expect(calculateThumbPosition(100, 0, 100)).toBe(100);
  });

  it("should calculate the correct percentage for an arbitrary value", () => {
    expect(calculateThumbPosition(25, 0, 100)).toBe(25);
    expect(calculateThumbPosition(75, 0, 100)).toBe(75);
    expect(calculateThumbPosition(10, 0, 50)).toBe(20);
  });

  it("should handle ranges that do not start at 0", () => {
    expect(calculateThumbPosition(75, 50, 100)).toBe(50);
    expect(calculateThumbPosition(50, 50, 100)).toBe(0);
    expect(calculateThumbPosition(100, 50, 100)).toBe(100);
  });

  it("should return 0 if max is equal to min to avoid division by zero", () => {
    expect(calculateThumbPosition(5, 5, 5)).toBe(0);
  });
});

describe("getClosestValue", () => {
  const fixedValues = [0, 25, 50, 75, 100];

  it("should return the closest value from the array", () => {
    expect(getClosestValue(23, fixedValues)).toBe(25);
    expect(getClosestValue(55, fixedValues)).toBe(50);
  });

  it("should return the value itself if it exists in the array", () => {
    expect(getClosestValue(25, fixedValues)).toBe(25);
  });

  it("should return the smaller value if the target is exactly between two values", () => {
    expect(getClosestValue(12.5, fixedValues)).toBe(0);
    expect(getClosestValue(37.5, fixedValues)).toBe(25);
  });

  it("should handle values outside the range", () => {
    expect(getClosestValue(-10, fixedValues)).toBe(0);
    expect(getClosestValue(110, fixedValues)).toBe(100);
  });

  it("should work with negative numbers", () => {
    const negativeValues = [-100, -50, 0, 50, 100];
    expect(getClosestValue(-60, negativeValues)).toBe(-50);
    expect(getClosestValue(20, negativeValues)).toBe(0);
  });
});

describe("getStepValue", () => {
  describe("without fixed values", () => {
    it("should increase the value by the default step (1)", () => {
      expect(getStepValue(10, "increase")).toBe(11);
    });

    it("should decrease the value by the default step (1)", () => {
      expect(getStepValue(10, "decrease")).toBe(9);
    });
  });

  describe("with fixed values", () => {
    const fixedValues = [0, 10, 20, 30, 40, 50];

    it("should return the next value in the array when increasing", () => {
      expect(getStepValue(20, "increase", fixedValues)).toBe(30);
    });

    it("should return the previous value in the array when decreasing", () => {
      expect(getStepValue(20, "decrease", fixedValues)).toBe(10);
    });

    it("should return the same value if increasing from the last value", () => {
      expect(getStepValue(50, "increase", fixedValues)).toBe(50);
    });

    it("should return the same value if decreasing from the first value", () => {
      expect(getStepValue(0, "decrease", fixedValues)).toBe(0);
    });

    it("should return the min value if it is not found in the array", () => {
      expect(getStepValue(15, "increase", fixedValues)).toBe(0);
      expect(getStepValue(15, "decrease", fixedValues)).toBe(0);
    });
  });
});
