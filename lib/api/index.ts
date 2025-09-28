import {
  ApiResponse,
  LimitedRange,
  RangeLimitsSchema,
  FixedRange,
  RangeArraySchema,
} from "@/types";

const API_URL = process.env.API_URL;

const ApiEndpoints = {
  limits: "/limits",
  range: "/range",
} as const;

export async function getLimits(): Promise<ApiResponse<LimitedRange>> {
  try {
    const res = await fetch(`${API_URL}${ApiEndpoints.limits}`);

    if (!res.ok) {
      return { ok: false, error: String(res.status) };
    }

    const data = await res.json();
    const sliderLimitsValidation = RangeLimitsSchema.safeParse(data);

    if (!sliderLimitsValidation.success) {
      return { ok: false, error: sliderLimitsValidation.error.message };
    }

    return { ok: true, data: sliderLimitsValidation.data };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Unknown error" };
  }
}

export async function getRange(): Promise<ApiResponse<FixedRange>> {
  try {
    const res = await fetch(`${API_URL}${ApiEndpoints.range}`);

    if (!res.ok) {
      return { ok: false, error: `${res.status}` };
    }

    const data = await res.json();
    const sliderRangeValidation = RangeArraySchema.safeParse(data);

    if (!sliderRangeValidation.success) {
      return { ok: false, error: sliderRangeValidation.error.message };
    }

    return { ok: true, data: sliderRangeValidation.data };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Unknown error" };
  }
}
