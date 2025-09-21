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
