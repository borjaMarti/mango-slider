import { http, HttpResponse } from "msw";
import { mockLimitsData, mockRangeData } from "@/mocks/data";

export const handlers = [
  http.get("https://api.test.com/limits", () => {
    return HttpResponse.json(mockLimitsData);
  }),
  http.get("https://api.test.com/range", () => {
    return HttpResponse.json(mockRangeData);
  }),
];
