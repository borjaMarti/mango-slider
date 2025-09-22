"use client";
import { useSlider } from "@/hooks/use-slider";
import { SliderProps } from "@/types";
import styles from "./slider.module.css";
import SliderInput from "./slider-input";
import SliderThumb from "./slider-thumb";

export default function Slider(props: SliderProps) {
  const {
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
  } = useSlider(props);

  return (
    <div className={`${styles.root} ${activeThumb ? styles.grabbing : ""}`}>
      <div className={styles.inputsContainer}>
        <SliderInput
          isDisabled={!!props.fixedValues}
          value={startInput}
          min={min}
          max={max}
          onChange={handleStartChange}
          onBlur={handleStartBlur}
          onKeyDown={handleStartInputKeyDown}
          describedById="start-value-currency"
          currencyText="Euros"
        />

        <SliderInput
          isDisabled={!!props.fixedValues}
          value={endInput}
          min={min}
          max={max}
          onChange={handleEndChange}
          onBlur={handleEndBlur}
          onKeyDown={handleEndInputKeyDown}
          describedById="end-value-currency"
          currencyText="Euros"
        />
      </div>

      <span ref={trackRef} className={styles.track}>
        <span
          className={styles.activeTrack}
          style={{
            left: `${startThumbPosition}%`,
            width: `${endThumbPosition - startThumbPosition}%`,
          }}
        />

        <SliderThumb
          thumbRef={startThumbRef}
          position={startThumbPosition}
          value={startInput}
          min={min}
          max={max}
          isActive={activeThumb === "start"}
          isOverlapping={areThumbsOverlapping}
          thumbType="start"
          onKeyDown={handleStartKeyDown}
          onMouseDown={(e) => {
            e.preventDefault();
            setActiveThumb("start");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setActiveThumb("start");
          }}
        />

        <SliderThumb
          thumbRef={endThumbRef}
          position={endThumbPosition}
          value={endInput}
          min={min}
          max={max}
          isActive={activeThumb === "end"}
          isOverlapping={areThumbsOverlapping}
          thumbType="end"
          onKeyDown={handleEndKeyDown}
          onMouseDown={(e) => {
            e.preventDefault();
            setActiveThumb("end");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setActiveThumb("end");
          }}
        />
      </span>
    </div>
  );
}
