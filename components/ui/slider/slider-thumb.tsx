"use client";
import React from "react";
import { SliderThumbProps } from "@/types";
import styles from "./slider-thumb.module.css";

export default function SliderThumb({
  thumbRef,
  position,
  value,
  min,
  max,
  isActive,
  isOverlapping,
  thumbType,
  onKeyDown,
  onMouseDown,
  onTouchStart,
}: SliderThumbProps) {
  const overlappingClass = isOverlapping
    ? thumbType === "start"
      ? styles.startThumbOverlapping
      : styles.endThumbOverlapping
    : "";

  return (
    <div
      className={`${styles.thumbContainer} ${overlappingClass}`}
      style={{ left: `${position}%` }}
    >
      {isOverlapping && <span className={styles.overlappingThumbLine} />}
      <span
        ref={thumbRef}
        className={`${styles.thumb} ${isActive ? styles.grabbing : ""}`}
        role="slider"
        aria-valuenow={Number(value)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={`${value}€`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
    </div>
  );
}
