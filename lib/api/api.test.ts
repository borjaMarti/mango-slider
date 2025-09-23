import { describe, it, expect, vi, beforeEach } from "vitest";
import { RangeLimitsSchema, RangeArraySchema } from "@/types";
import type { getLimits as GetLimitsType, getRange as GetRangeType } from ".";

// Declare variables to hold the dynamically imported functions
let getLimits: typeof GetLimitsType;
let getRange: typeof GetRangeType;

const MOCKED_API_URL = "https://api.test.com";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Service", () => {
  beforeEach(async () => {
    process.env.API_URL = MOCKED_API_URL;
    // We import "api" dynamically after setting process.env.API_URL
    // so the variable is ready (otherwise will be undefined)
    const api = await import(".");
    getLimits = api.getLimits;
    getRange = api.getRange;
  });

  describe("getLimits", () => {
    it("should return limits data on a successful API call", async () => {
      const mockData = { min: 10, max: 200 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getLimits();

      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/limits`);
      expect(result).toEqual({ ok: true, data: mockData });
    });

    it("should return an error when the API response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await getLimits();

      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/limits`);
      expect(result).toEqual({ ok: false, error: "404" });
    });

    it("should return an error when the data format is invalid", async () => {
      const invalidData = { minimum: 0 }; // Missing 'max', incorrect 'min' key
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidData),
      });

      const validationResult = RangeLimitsSchema.safeParse(invalidData);
      let errorMessage = "";
      if (!validationResult.success) {
        errorMessage = validationResult.error.message;
      }

      const result = await getLimits();
      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/limits`);
      expect(result).toEqual({ ok: false, error: errorMessage });
    });

    it("should return an error when fetch throws an Error instance", async () => {
      const error = new Error("Network failure");
      mockFetch.mockRejectedValue(error);

      const result = await getLimits();
      expect(result).toEqual({ ok: false, error: "Network failure" });
    });

    it('should return an "Unknown error" when fetch throws a non-Error object', async () => {
      mockFetch.mockRejectedValue({ message: "some other error" });

      const result = await getLimits();
      expect(result).toEqual({ ok: false, error: "Unknown error" });
    });
  });

  describe("getRange", () => {
    it("should return range data on a successful API call", async () => {
      const mockData = { range: [10, 20, 30, 40, 50] };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getRange();

      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/range`);
      expect(result).toEqual({ ok: true, data: mockData });
    });

    it("should return an error when the API response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await getRange();
      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/range`);
      expect(result).toEqual({ ok: false, error: "500" });
    });

    it("should return an error when the data format is invalid", async () => {
      const invalidData = { ranges: [10, 90] }; // Incorrect key 'ranges' instead of 'range'
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidData),
      });

      const validationResult = RangeArraySchema.safeParse(invalidData);
      let errorMessage = "";
      if (!validationResult.success) {
        errorMessage = validationResult.error.message;
      }

      const result = await getRange();
      expect(mockFetch).toHaveBeenCalledWith(`${MOCKED_API_URL}/range`);
      expect(result).toEqual({ ok: false, error: errorMessage });
    });

    it("should return an error when fetch throws an Error instance", async () => {
      const error = new Error("API server is down");
      mockFetch.mockRejectedValue(error);

      const result = await getRange();
      expect(result).toEqual({ ok: false, error: "API server is down" });
    });

    it('should return an "Unknown error" when fetch throws a non-Error object', async () => {
      mockFetch.mockRejectedValue("a string error");

      const result = await getRange();
      expect(result).toEqual({ ok: false, error: "Unknown error" });
    });
  });
});
