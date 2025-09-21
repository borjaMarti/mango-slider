import { useState, useMemo } from "react";
import { SliderProps } from "@/types";

export function useSlider(props: SliderProps) {
  const { min, max } = useMemo(() => {
    if (props.fixedValues) {
      return {
        min: props.fixedValues[0],
        max: props.fixedValues[props.fixedValues.length - 1],
      };
    }
    return { min: props.min, max: props.max };
  }, [props]);

  const [startValue, setStartValue] = useState(String(min));
  const [endValue, setEndValue] = useState(String(max));

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartValue(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndValue(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleStartBlur = () => {
    const numericEnd = Number(endValue);
    let numericStart = Number(startValue);

    if (startValue === "" || isNaN(numericStart)) {
      numericStart = min;
    }

    const finalValue = Math.min(Math.max(numericStart, min), numericEnd);
    setStartValue(String(finalValue));
  };

  const handleEndBlur = () => {
    const numericStart = Number(startValue);
    let numericEnd = Number(endValue);

    if (endValue === "" || isNaN(numericEnd)) {
      numericEnd = max;
    }

    const finalValue = Math.min(Math.max(numericEnd, numericStart), max);
    setEndValue(String(finalValue));
  };

  return {
    startValue,
    endValue,
    handleStartChange,
    handleEndChange,
    handleStartBlur,
    handleEndBlur,
  };
}
