import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SliderProps } from "@/types";
import {
  clamp,
  calculateThumbPosition,
  getClosestValue,
  getStepValue,
} from "@/lib/utils";

export function useSlider(props: SliderProps) {
  const trackRef = useRef<HTMLSpanElement>(null);
  const startThumbRef = useRef<HTMLSpanElement>(null);
  const endThumbRef = useRef<HTMLSpanElement>(null);

  const { min, max, fixedValues } = useMemo(() => {
    if (props.fixedValues) {
      return {
        min: props.fixedValues[0],
        max: props.fixedValues[props.fixedValues.length - 1],
        fixedValues: props.fixedValues,
      };
    }
    return { min: props.min, max: props.max, fixedValues: undefined };
  }, [props]);

  const [startValue, setStartValue] = useState(min);
  const [endValue, setEndValue] = useState(max);
  const [startInput, setStartInput] = useState(String(startValue));
  const [endInput, setEndInput] = useState(String(endValue));
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | null>(null);
  const [areThumbsOverlapping, setAreThumbsOverlapping] = useState(false);

  const startThumbPosition = useMemo(
    () => calculateThumbPosition(startValue, min, max),
    [startValue, min, max],
  );
  const endThumbPosition = useMemo(
    () => calculateThumbPosition(endValue, min, max),
    [endValue, min, max],
  );

  const calculateMaxStart = useCallback(
    (currentEndValue: number) =>
      getStepValue(currentEndValue, "decrease", fixedValues),
    [fixedValues],
  );

  const calculateMinEnd = useCallback(
    (currentStartValue: number) =>
      getStepValue(currentStartValue, "increase", fixedValues),
    [fixedValues],
  );

  const handleDrag = useCallback(
    (e: PointerEvent) => {
      if (!activeThumb || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const percentage = clamp(
        (e.clientX - trackRect.left) / trackRect.width,
        0,
        1,
      );
      let newValue = min + percentage * (max - min);

      newValue = fixedValues
        ? getClosestValue(newValue, fixedValues)
        : Math.round(newValue);

      if (activeThumb === "start") {
        const maxAllowedStart = calculateMaxStart(endValue);
        const newStartValue = clamp(newValue, min, maxAllowedStart);
        setStartValue(newStartValue);
        setStartInput(String(newStartValue));
      } else {
        const minAllowedEnd = calculateMinEnd(startValue);
        const newEndValue = clamp(newValue, minAllowedEnd, max);
        setEndValue(newEndValue);
        setEndInput(String(newEndValue));
      }
    },
    [
      activeThumb,
      min,
      max,
      fixedValues,
      startValue,
      endValue,
      calculateMaxStart,
      calculateMinEnd,
    ],
  );

  const handleDragEnd = useCallback(() => {
    setActiveThumb(null);
  }, []);

  const handleStartKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      const maxStart = calculateMaxStart(endValue);
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          setStartValue((v) =>
            clamp(getStepValue(v, "increase", fixedValues), min, maxStart),
          );
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          setStartValue((v) =>
            clamp(getStepValue(v, "decrease", fixedValues), min, maxStart),
          );
          break;
        case "Home":
          e.preventDefault();
          setStartValue(min);
          break;
        case "End":
          e.preventDefault();
          setStartValue(maxStart);
          break;
      }
    },
    [min, endValue, fixedValues, calculateMaxStart],
  );

  const handleEndKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      const minEnd = calculateMinEnd(startValue);
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          setEndValue((v) =>
            clamp(getStepValue(v, "increase", fixedValues), minEnd, max),
          );
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          setEndValue((v) =>
            clamp(getStepValue(v, "decrease", fixedValues), minEnd, max),
          );
          break;
        case "Home":
          e.preventDefault();
          setEndValue(minEnd);
          break;
        case "End":
          e.preventDefault();
          setEndValue(max);
          break;
      }
    },
    [max, startValue, fixedValues, calculateMinEnd],
  );

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 3));
  };
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 3));
  };

  const handleStartBlur = useCallback(() => {
    const numericStart = Number(startInput);
    const value = isNaN(numericStart) ? min : numericStart;
    const maxStart = calculateMaxStart(endValue);
    const newValue = clamp(value, min, maxStart);
    setStartValue(newValue);
    setStartInput(String(newValue));
  }, [startInput, min, endValue, calculateMaxStart]);

  const handleEndBlur = useCallback(() => {
    const numericEnd = Number(endInput);
    const value = isNaN(numericEnd) ? max : numericEnd;
    const minEnd = calculateMinEnd(startValue);
    const newValue = clamp(value, minEnd, max);
    setEndValue(newValue);
    setEndInput(String(newValue));
  }, [endInput, max, startValue, calculateMinEnd]);

  const handleStartInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleStartBlur();
      e.currentTarget.blur();
    }
  };

  const handleEndInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEndBlur();
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    setStartInput(String(startValue));
  }, [startValue]);

  useEffect(() => {
    setEndInput(String(endValue));
  }, [endValue]);

  useEffect(() => {
    if (activeThumb) {
      window.addEventListener("pointermove", handleDrag);
      window.addEventListener("pointerup", handleDragEnd);
      window.addEventListener("pointercancel", handleDragEnd);
      return () => {
        window.removeEventListener("pointermove", handleDrag);
        window.removeEventListener("pointerup", handleDragEnd);
        window.removeEventListener("pointercancel", handleDragEnd);
      };
    }
  }, [activeThumb, handleDrag, handleDragEnd]);

  useEffect(() => {
    if (trackRef.current && startThumbRef.current) {
      const trackWidth = trackRef.current.getBoundingClientRect().width;
      const thumbWidth = startThumbRef.current.getBoundingClientRect().width;
      const thumbWidthPercentage = (thumbWidth / trackWidth) * 100;
      setAreThumbsOverlapping(
        endThumbPosition - startThumbPosition < thumbWidthPercentage,
      );
    }
  }, [startThumbPosition, endThumbPosition]);

  return {
    trackRef,
    startThumbRef,
    endThumbRef,
    min,
    max,
    startInput,
    endInput,
    startThumbPosition,
    endThumbPosition,
    activeThumb,
    setActiveThumb,
    handleStartChange,
    handleEndChange,
    handleStartBlur,
    handleEndBlur,
    handleStartKeyDown,
    handleEndKeyDown,
    handleStartInputKeyDown,
    handleEndInputKeyDown,
    areThumbsOverlapping,
  };
}
