"use client";
import React from "react";
import { RangeThumbProps } from "@/types";
import styles from "./range-thumb.module.css";

export default function RangeThumb({
  thumbRef,
  position,
  value,
  min,
  max,
  isActive,
  isOverlapping,
  thumbType,
  onKeyDown,
  onPointerDown,
}: RangeThumbProps) {
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
        onPointerDown={onPointerDown}
      />
    </div>
  );
}
