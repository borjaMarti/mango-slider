"use client";
import { useSlider } from "@/hooks/use-slider";
import { RangeProps } from "@/types";
import styles from "./range.module.css";
import RangeInput from "./range-input";
import RangeThumb from "./range-thumb";

export default function Range(props: RangeProps) {
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
        <RangeInput
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

        <RangeInput
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

        <RangeThumb
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

        <RangeThumb
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
