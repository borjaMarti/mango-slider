import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Range } from ".";

describe("Slider Keyboard Functionality", () => {
  // Test Suite for a continuous slider (no fixed values)
  describe("Continuous Slider", () => {
    it("should increment/decrement thumb values with arrow keys", async () => {
      const user = userEvent.setup();
      render(<Range min={1} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");

      // 3 tabs because of the 2 inputs until thumb
      await user.tab();
      await user.tab();
      await user.tab();
      expect(startThumb).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(startThumb).toHaveAttribute("aria-valuenow", "2");

      await user.keyboard("{ArrowLeft}");
      expect(startThumb).toHaveAttribute("aria-valuenow", "1");

      // Test the end thumb
      await user.tab();
      expect(endThumb).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      expect(endThumb).toHaveAttribute("aria-valuenow", "99");

      await user.keyboard("{ArrowUp}");
      expect(endThumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("should move thumbs to min/max with Home/End keys without crossing over", async () => {
      const user = userEvent.setup();
      render(<Range min={1} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");

      await user.tab();
      await user.tab();
      await user.tab();
      await user.keyboard("{End}");
      expect(startThumb).toHaveAttribute("aria-valuenow", "99");

      await user.keyboard("{Home}");
      expect(startThumb).toHaveAttribute("aria-valuenow", "1");

      await user.tab();
      await user.keyboard("{Home}");
      expect(endThumb).toHaveAttribute("aria-valuenow", "2");
    });

    it("should update thumb value when typing in the input and pressing Enter", async () => {
      const user = userEvent.setup();
      render(<Range min={1} max={100} />);

      const inputs = screen.getAllByRole("textbox");
      const startInput = inputs[0];
      const [startThumb] = screen.getAllByRole("slider");

      await user.clear(startInput);
      await user.type(startInput, "35{Enter}");

      expect(startInput).toHaveValue("35");
      expect(startThumb).toHaveAttribute("aria-valuenow", "35");
    });

    it("should update thumb value on input blur", async () => {
      const user = userEvent.setup();
      render(<Range min={1} max={100} />);

      const inputs = screen.getAllByRole("textbox");
      const endInput = inputs[1];
      const [, endThumb] = screen.getAllByRole("slider");

      await user.clear(endInput);
      await user.type(endInput, "65");
      await user.tab();

      expect(endInput).toHaveValue("65");
      expect(endThumb).toHaveAttribute("aria-valuenow", "65");
    });
  });

  // Test Suite for a stepped slider (with fixed values)
  describe("Fixed Values (Stepped) Slider", () => {
    const fixedValues: [number, number, ...number[]] = [
      1.99, 5.99, 10.99, 30.99, 50.99, 70.99,
    ];

    it("should jump to the next/previous fixed value with arrow keys", async () => {
      const user = userEvent.setup();
      render(<Range fixedValues={fixedValues} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");

      // Test start thumb
      await user.tab();
      expect(startThumb).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(startThumb).toHaveAttribute("aria-valuenow", "5.99");

      // Test end thumb
      await user.tab();
      expect(endThumb).toHaveFocus();
      await user.keyboard("{ArrowLeft}");
      expect(endThumb).toHaveAttribute("aria-valuenow", "50.99");
    });
  });
});
