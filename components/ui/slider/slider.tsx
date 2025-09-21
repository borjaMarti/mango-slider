"use client";
import { useSlider } from "@/hooks/use-slider";
import { SliderProps } from "@/types";
import styles from "./slider.module.css";

export default function Slider(props: SliderProps) {
  const {
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
  } = useSlider(props);

  return (
    <div
      className={styles.root}
      style={{
        cursor: activeThumb ? "grabbing" : "",
      }}
    >
      <div className={styles.inputWrapper}>
        <input
          disabled={!!props.fixedValues}
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={startInput}
          onChange={handleStartChange}
          onBlur={handleStartBlur}
          onKeyDown={handleStartInputKeyDown}
          aria-describedby="start-value-currency"
        />
        <span id="start-value-currency" className="visually-hidden">
          Euros
        </span>
      </div>
      <span ref={trackRef} className={styles.track}>
        <span
          ref={startThumbRef}
          className={`${styles.thumb} ${
            activeThumb === "start" ? styles.grabbing : ""
          }`}
          style={{
            left: `${startThumbPosition}%`,
            cursor: activeThumb === "start" ? "grabbing" : "",
          }}
          role="slider"
          aria-valuenow={Number(startInput)}
          aria-valuemin={props.fixedValues ? props.fixedValues[0] : props.min}
          aria-valuemax={
            props.fixedValues
              ? props.fixedValues[props.fixedValues.length - 1]
              : props.max
          }
          aria-valuetext={`${startInput}€`}
          tabIndex={0}
          onKeyDown={handleStartKeyDown}
          onMouseDown={() => setActiveThumb("start")}
          onTouchStart={(e) => {
            setActiveThumb("start");
          }}
        />
        <span
          ref={endThumbRef}
          className={`${styles.thumb} ${
            activeThumb === "end" ? styles.grabbing : ""
          }`}
          style={{
            left: `${endThumbPosition}%`,
            cursor: activeThumb === "end" ? "grabbing" : "",
          }}
          role="slider"
          aria-valuenow={Number(endInput)}
          aria-valuemin={props.fixedValues ? props.fixedValues[0] : props.min}
          aria-valuemax={
            props.fixedValues
              ? props.fixedValues[props.fixedValues.length - 1]
              : props.max
          }
          aria-valuetext={`${endInput}€`}
          tabIndex={0}
          onKeyDown={handleEndKeyDown}
          onMouseDown={() => {
            setActiveThumb("end");
          }}
          onTouchStart={(e) => {
            setActiveThumb("end");
          }}
        />
      </span>
      <div className={styles.inputWrapper}>
        <input
          disabled={!!props.fixedValues}
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={endInput}
          onChange={handleEndChange}
          onBlur={handleEndBlur}
          onKeyDown={handleEndInputKeyDown}
          aria-describedby="end-value-currency"
        />
        <span id="end-value-currency" className="visually-hidden">
          Euros
        </span>
      </div>
    </div>
  );
}
