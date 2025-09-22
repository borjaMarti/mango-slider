import { z } from "zod";

export const RangeLimitsSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const RangeArraySchema = z.object({
  range: z.tuple([z.number(), z.number()]).rest(z.number()),
});

export type LimitedRange = z.infer<typeof RangeLimitsSchema>;
export type FixedRange = z.infer<typeof RangeArraySchema>;

interface LimitedRangeProps {
  fixedValues?: false;
  min: number;
  max: number;
}

interface FixedRangeProps {
  fixedValues: [number, number, ...number[]];
}

export type RangeProps = LimitedRangeProps | FixedRangeProps;

export interface RangeInputProps {
  currencyText: string;
  describedById: string;
  isDisabled: boolean;
  min: number;
  max: number;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

export interface RangeThumbProps {
  isActive: boolean;
  isOverlapping: boolean;
  min: number;
  max: number;
  onKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLSpanElement>) => void;
  position: number;
  thumbRef: React.RefObject<HTMLSpanElement | null>;
  thumbType: "start" | "end";
  value: string;
}
