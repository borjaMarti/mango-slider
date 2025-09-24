import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks";
import { mockLimitsData, mockRangeData } from "@/mocks/data";
import { RangeLimitsSchema, RangeArraySchema } from "@/types";
import type { getLimits as GetLimitsType, getRange as GetRangeType } from ".";

const MOCKED_API_URL = "https://api.test.com";

let getLimits: typeof GetLimitsType;
let getRange: typeof GetRangeType;

describe("API Service", () => {
  beforeEach(async () => {
    // We dynamically import api so we can pre-set API_URL.
    process.env.API_URL = MOCKED_API_URL;
    const api = await import(".");
    getLimits = api.getLimits;
    getRange = api.getRange;
  });

  // No afterEach is needed to restore mocks, as MSW handles this with
  // server.resetHandlers() which is typically configured globally.

  describe("getLimits", () => {
    it("should return limits data on a successful API call", async () => {
      const result = await getLimits();
      expect(result).toEqual({ ok: true, data: mockLimitsData });
    });

    it("should return an error when the API response is not ok", async () => {
      server.use(
        http.get(`${MOCKED_API_URL}/limits`, () => {
          return new HttpResponse(null, { status: 404 });
        }),
      );

      const result = await getLimits();
      expect(result).toEqual({ ok: false, error: "404" });
    });

    it("should return a validation error when the data format is invalid", async () => {
      const invalidData = { minimum: 0 };
      server.use(
        http.get(`${MOCKED_API_URL}/limits`, () => {
          return HttpResponse.json(invalidData);
        }),
      );

      const result = await getLimits();

      // Mock Zod error message.
      const validationResult = RangeLimitsSchema.safeParse(invalidData);
      const errorMessage = validationResult.error?.message;

      expect(result).toEqual({ ok: false, error: errorMessage });
    });

    it("should return an error on network failure", async () => {
      server.use(
        http.get(`${MOCKED_API_URL}/limits`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await getLimits();
      expect(result).toEqual({ ok: false, error: "Failed to fetch" });
    });
  });

  describe("getRange", () => {
    it("should return range data on a successful API call", async () => {
      const result = await getRange();
      expect(result).toEqual({ ok: true, data: mockRangeData });
    });

    it("should return an error when the API response is not ok", async () => {
      server.use(
        http.get(`${MOCKED_API_URL}/range`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      const result = await getRange();
      expect(result).toEqual({ ok: false, error: "500" });
    });

    it("should return a validation error when the data format is invalid", async () => {
      const invalidData = { ranges: [10, 90] }; // Incorrect key 'ranges'
      server.use(
        http.get(`${MOCKED_API_URL}/range`, () => {
          return HttpResponse.json(invalidData);
        }),
      );

      const result = await getRange();

      // Mock Zod error message.
      const validationResult = RangeArraySchema.safeParse(invalidData);
      let errorMessage = validationResult.error?.message;

      expect(result).toEqual({ ok: false, error: errorMessage });
    });

    it("should return an error on network failure", async () => {
      server.use(
        http.get(`${MOCKED_API_URL}/range`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await getRange();
      expect(result).toEqual({ ok: false, error: "Failed to fetch" });
    });
  });
});
