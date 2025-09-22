"use client";
import React from "react";
import { SliderInputProps } from "@/types";
import styles from "./slider-input.module.css";

export default function SliderInput({
  isDisabled,
  value,
  min,
  max,
  onChange,
  onBlur,
  onKeyDown,
  describedById,
  currencyText,
}: SliderInputProps) {
  return (
    <div className={styles.inputWrapper}>
      <input
        disabled={isDisabled}
        className={styles.input}
        type="text"
        inputMode="numeric"
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        aria-describedby={describedById}
      />
      <span id={describedById} className="visually-hidden">
        {currencyText}
      </span>
    </div>
  );
}
