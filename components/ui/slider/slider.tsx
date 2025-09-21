"use client";
import { useSlider } from "@/hooks/use-slider";
import { SliderProps } from "@/types";
import styles from "./slider.module.css";

export default function Slider(props: SliderProps) {
  const {
    startValue,
    endValue,
    handleStartChange,
    handleEndChange,
    handleStartBlur,
    handleEndBlur,
  } = useSlider(props);

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper}>
        <input
          disabled={!!props.fixedValues}
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={startValue}
          onChange={handleStartChange}
          onBlur={handleStartBlur}
          aria-describedby="start-value-currency"
        />
        <span id="start-value-currency" className="visually-hidden">
          Euros
        </span>
      </div>
      <span className={styles.track}>
        <span className={styles.thumb} />
        <span className={styles.thumb} />
      </span>
      <div className={styles.inputWrapper}>
        <input
          disabled={!!props.fixedValues}
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={endValue}
          onChange={handleEndChange}
          onBlur={handleEndBlur}
          aria-describedby="end-value-currency"
        />
        <span id="end-value-currency" className="visually-hidden">
          Euros
        </span>
      </div>
    </div>
  );
}
