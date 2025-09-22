import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SliderProps } from "@/types";

export function useSlider(props: SliderProps) {
  const trackRef = useRef<HTMLSpanElement>(null);
  const startThumbRef = useRef<HTMLSpanElement>(null);
  const endThumbRef = useRef<HTMLSpanElement>(null);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | null>(null);

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

  const startThumbPosition = useMemo(
    () => ((startValue - min) / (max - min)) * 100,
    [startValue, min, max],
  );
  const endThumbPosition = useMemo(
    () => ((endValue - min) / (max - min)) * 100,
    [endValue, min, max],
  );

  const getNextValue = (currentValue: number) => {
    if (fixedValues) {
      const currentIndex = fixedValues.indexOf(currentValue);
      if (currentIndex < fixedValues.length - 1) {
        return fixedValues[currentIndex + 1];
      }
      return currentValue;
    }
    return currentValue + 1;
  };

  const getPrevValue = (currentValue: number) => {
    if (fixedValues) {
      const currentIndex = fixedValues.indexOf(currentValue);
      if (currentIndex > 0) {
        return fixedValues[currentIndex - 1];
      }
      return currentValue;
    }
    return currentValue - 1;
  };

  const handleStartKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp": {
        e.preventDefault();
        const nextVal = getNextValue(startValue);
        const maxStart = calculateMaxStart(endValue);
        const calculatedNextVal = Math.min(nextVal, maxStart);
        setStartValue(calculatedNextVal);
        setStartInput(String(calculatedNextVal));
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        e.preventDefault();
        const prevVal = getPrevValue(startValue);
        const calculatedPrevVal = Math.max(prevVal, min);
        setStartValue(calculatedPrevVal);
        setStartInput(String(calculatedPrevVal));
        break;
      }
      case "Home": {
        e.preventDefault();
        setStartValue(min);
        setStartInput(String(min));
        break;
      }
      case "End": {
        e.preventDefault();
        const maxStart = calculateMaxStart(endValue);
        setStartValue(maxStart);
        setStartInput(String(maxStart));
        break;
      }
      default:
        break;
    }
  };

  const handleEndKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp": {
        e.preventDefault();
        const nextVal = getNextValue(endValue);
        const calculatedNextVal = Math.min(nextVal, max);
        setEndValue(calculatedNextVal);
        setEndInput(String(calculatedNextVal));
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        e.preventDefault();
        const prevVal = getPrevValue(endValue);
        const minEnd = calculateMinEnd(startValue);
        const calculatedPrevVal = Math.max(prevVal, minEnd);
        setEndValue(calculatedPrevVal);
        setEndInput(String(calculatedPrevVal));
        break;
      }
      case "Home": {
        e.preventDefault();
        const minEnd = calculateMinEnd(startValue);
        setEndValue(minEnd);
        setEndInput(String(minEnd));
        break;
      }
      case "End": {
        e.preventDefault();
        setEndValue(max);
        setEndInput(String(max));
        break;
      }
      default:
        break;
    }
  };

  function calculateMaxStart(currentEndValue: number) {
    if (fixedValues) {
      const endIndex = fixedValues.indexOf(currentEndValue);
      return endIndex > 0 ? fixedValues[endIndex - 1] : min;
    }
    return currentEndValue - 1;
  }

  function calculateMinEnd(currentStartValue: number) {
    if (fixedValues) {
      const startIndex = fixedValues.indexOf(currentStartValue);
      return startIndex < fixedValues.length - 1
        ? fixedValues[startIndex + 1]
        : max;
    }
    return currentStartValue + 1;
  }

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!activeThumb || !trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = clientX - trackRect.left;
    const percentage = Math.max(0, Math.min(1, position / trackRect.width));

    let newValue = min + percentage * (max - min);

    if (fixedValues) {
      newValue = fixedValues.reduce((prev, curr) =>
        Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev,
      );
    } else {
      newValue = Math.round(newValue);
    }

    if (activeThumb === "start") {
      const maxAllowedStart = calculateMaxStart(endValue);
      const newCalculatedValue = Math.min(newValue, maxAllowedStart);
      setStartValue(newCalculatedValue);
      setStartInput(String(newCalculatedValue));
    } else {
      const minAllowedEnd = calculateMinEnd(startValue);
      const newCalculatedValue = Math.max(newValue, minAllowedEnd);
      setEndValue(newCalculatedValue);
      setEndInput(String(newCalculatedValue));
    }
  };

  const handleDragEnd = () => {
    if (activeThumb === "start" && startThumbRef.current) {
      startThumbRef.current.blur();
    } else if (activeThumb === "end" && endThumbRef.current) {
      endThumbRef.current.blur();
    }
    setActiveThumb(null);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    setStartInput(sanitizedValue.slice(0, 3));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    setEndInput(sanitizedValue.slice(0, 3));
  };

  const handleStartBlur = () => {
    let numericStart = Number(startInput);
    if (startInput === "" || isNaN(numericStart)) {
      numericStart = min;
    }
    const maxStart = calculateMaxStart(endValue);
    const newValue = Math.min(Math.max(numericStart, min), maxStart);
    setStartValue(newValue);
    setStartInput(String(newValue));
  };

  const handleEndBlur = () => {
    let numericEnd = Number(endInput);
    if (endInput === "" || isNaN(numericEnd)) {
      numericEnd = max;
    }
    const minEnd = calculateMinEnd(startValue);
    const newValue = Math.min(Math.max(numericEnd, minEnd), max);
    setEndValue(newValue);
    setEndInput(String(newValue));
  };

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
    if (activeThumb) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [activeThumb]);

  return {
    trackRef,
    startThumbRef,
    endThumbRef,
    startInput,
    endInput,
    startThumbPosition,
    endThumbPosition,
    handleStartChange,
    handleEndChange,
    handleStartBlur,
    handleEndBlur,
    activeThumb,
    setActiveThumb,
    handleStartKeyDown,
    handleEndKeyDown,
    handleStartInputKeyDown,
    handleEndInputKeyDown,
  };
}
