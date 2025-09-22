import { z } from "zod";

export const SliderLimitsSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const SliderRangeSchema = z.object({
  range: z.tuple([z.number(), z.number()]).rest(z.number()),
});

export type SliderLimits = z.infer<typeof SliderLimitsSchema>;
export type SliderRange = z.infer<typeof SliderRangeSchema>;

interface RangeSliderProps {
  fixedValues?: false;
  min: number;
  max: number;
}

interface FixedSliderProps {
  fixedValues: [number, number, ...number[]];
}

export type SliderProps = RangeSliderProps | FixedSliderProps;

export interface SliderInputProps {
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

export interface SliderThumbProps {
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
