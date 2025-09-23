import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Range from "./range";

// In the JSDOM environment components don't have size or position, so we mock
// the getBoundingClientRect with a mock DOMRect object.
const mockBoundingClientRect = vi.fn();

describe("Range Component", () => {
  beforeEach(() => {
    // This makes the math easy: a clientX of 500 is exactly 50% of the way.
    // Track 1000px wide with x=0 for ease of calculation (clientX 500 = 50% of the track).
    mockBoundingClientRect.mockReturnValue({
      width: 1000,
      height: 2,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 2,
    });
    // Substitute with mock method in the Element prototype.
    Element.prototype.getBoundingClientRect = mockBoundingClientRect;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Dragging Functionality", () => {
    it("should move the start thumb when dragged", async () => {
      const user = userEvent.setup();
      render(<Range min={0} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");
      expect(startThumb).toHaveAttribute("aria-valuenow", "0");
      expect(endThumb).toHaveAttribute("aria-valuenow", "100");

      await user.pointer([
        { keys: "[MouseLeft>]", target: startThumb },
        { coords: { clientX: 500 } },
        { keys: "[/MouseLeft]" },
      ]);

      expect(startThumb).toHaveAttribute("aria-valuenow", "50");
      expect(screen.getByDisplayValue("50")).toBeInTheDocument();
      expect(endThumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("should move the end thumb when dragged", async () => {
      const user = userEvent.setup();
      render(<Range min={0} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");
      expect(startThumb).toHaveAttribute("aria-valuenow", "0");
      expect(endThumb).toHaveAttribute("aria-valuenow", "100");

      await user.pointer([
        { keys: "[MouseLeft>]", target: endThumb },
        { coords: { clientX: 750 } },
        { keys: "[/MouseLeft]" },
      ]);

      expect(endThumb).toHaveAttribute("aria-valuenow", "75");
      expect(screen.getByDisplayValue("75")).toBeInTheDocument();
      expect(startThumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("should not allow the start thumb to be dragged past the end thumb", async () => {
      const user = userEvent.setup();
      render(<Range min={0} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");
      await user.pointer([
        { keys: "[MouseLeft>]", target: endThumb },
        { coords: { clientX: 600 } },
        { keys: "[/MouseLeft]" },
      ]);
      expect(endThumb).toHaveAttribute("aria-valuenow", "60");

      await user.pointer([
        { keys: "[MouseLeft>]", target: startThumb },
        { coords: { clientX: 800 } },
      ]);

      expect(startThumb).toHaveAttribute("aria-valuenow", "59");
    });

    it("should not allow the end thumb to be dragged past the start thumb", async () => {
      const user = userEvent.setup();
      render(<Range min={0} max={100} />);

      const [startThumb, endThumb] = screen.getAllByRole("slider");
      await user.pointer([
        { keys: "[MouseLeft>]", target: startThumb },
        { coords: { clientX: 400 } },
        { keys: "[/MouseLeft]" },
      ]);
      expect(startThumb).toHaveAttribute("aria-valuenow", "40");

      await user.pointer([
        { keys: "[MouseLeft>]", target: endThumb },
        { coords: { clientX: 200 } },
      ]);

      expect(endThumb).toHaveAttribute("aria-valuenow", "41");
    });

    it("should snap to the closest fixed value when dragged", async () => {
      const user = userEvent.setup();
      const fixedValues: [number, number, ...number[]] = [0, 25, 50, 75, 100];
      render(<Range fixedValues={fixedValues} />);

      const [startThumb] = screen.getAllByRole("slider");

      // Closest value to 310 is 25.
      await user.pointer([
        { keys: "[MouseLeft>]", target: startThumb },
        { coords: { clientX: 310 } },
        { keys: "[/MouseLeft]" },
      ]);

      expect(startThumb).toHaveAttribute("aria-valuenow", "25");

      // Closest value to 410 is 50.
      await user.pointer([
        { keys: "[MouseLeft>]", target: startThumb },
        { coords: { clientX: 410 } },
        { keys: "[/MouseLeft]" },
      ]);

      expect(startThumb).toHaveAttribute("aria-valuenow", "50");
    });
  });

  // --- Keyboard Functionality Tests ---
  describe("Keyboard Functionality", () => {
    describe("Continuous Slider", () => {
      it("should increment/decrement thumb values with arrow keys", async () => {
        const user = userEvent.setup();
        render(<Range min={1} max={100} />);
        const [startThumb, endThumb] = screen.getAllByRole("slider");

        // Focus the start thumb.
        await user.tab(); // Start input.
        await user.tab(); // End input.
        await user.tab(); // Start thumb.
        expect(startThumb).toHaveFocus();

        await user.keyboard("{ArrowRight}");
        expect(startThumb).toHaveAttribute("aria-valuenow", "2");

        await user.keyboard("{ArrowLeft}");
        expect(startThumb).toHaveAttribute("aria-valuenow", "1");

        // Focus the end thumb.
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
        expect(startThumb).toHaveFocus();

        await user.keyboard("{End}");
        expect(startThumb).toHaveAttribute("aria-valuenow", "99");

        await user.keyboard("{Home}");
        expect(startThumb).toHaveAttribute("aria-valuenow", "1");

        await user.tab();
        expect(endThumb).toHaveFocus();

        await user.keyboard("{Home}");
        expect(endThumb).toHaveAttribute("aria-valuenow", "2");
      });

      it("should update thumb value when typing in the input and pressing Enter", async () => {
        const user = userEvent.setup();
        render(<Range min={1} max={100} />);

        const [startInput] = screen.getAllByRole("textbox");
        const [startThumb] = screen.getAllByRole("slider");

        await user.clear(startInput);
        await user.type(startInput, "35{Enter}");

        expect(startInput).toHaveValue("35");
        expect(startThumb).toHaveAttribute("aria-valuenow", "35");
      });

      it("should update thumb value on input blur", async () => {
        const user = userEvent.setup();
        render(<Range min={1} max={100} />);

        const [, endInput] = screen.getAllByRole("textbox");
        const [, endThumb] = screen.getAllByRole("slider");

        await user.clear(endInput);
        await user.type(endInput, "65");
        await user.tab(); // Blur the input.

        expect(endInput).toHaveValue("65");
        expect(endThumb).toHaveAttribute("aria-valuenow", "65");
      });
    });

    describe("Fixed Values (Stepped) Slider", () => {
      const fixedValues: [number, number, ...number[]] = [
        1.99, 5.99, 10.99, 30.99, 50.99, 70.99,
      ];

      it("should jump to the next/previous fixed value with arrow keys", async () => {
        const user = userEvent.setup();
        render(<Range fixedValues={fixedValues} />);
        const [startThumb, endThumb] = screen.getAllByRole("slider");

        // Focus the start thumb (only 1 input when fixedValues is true).
        await user.tab();
        expect(startThumb).toHaveFocus();
        await user.keyboard("{ArrowRight}");
        expect(startThumb).toHaveAttribute("aria-valuenow", "5.99");

        // Focus the end thumb.
        await user.tab();
        expect(endThumb).toHaveFocus();
        await user.keyboard("{ArrowLeft}");
        expect(endThumb).toHaveAttribute("aria-valuenow", "50.99");
      });
    });
  });
});
