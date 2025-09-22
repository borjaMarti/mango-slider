"use client";
import React from "react";
import { RangeInputProps } from "@/types";
import styles from "./range-input.module.css";

export default function RangeInput({
  isDisabled,
  value,
  min,
  max,
  onChange,
  onBlur,
  onKeyDown,
  describedById,
  currencyText,
}: RangeInputProps) {
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
