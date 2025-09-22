import { SliderShowcase } from "@/components/slider-showcase";
import { Slider } from "@/components/ui/slider";
import { getLimits } from "@/lib/api";

export default async function Exercise1Page() {
  const res = await getLimits();

  return (
    <SliderShowcase>
      <Slider
        min={res.ok ? res.data.min : 1}
        max={res.ok ? res.data.max : 100}
      />
    </SliderShowcase>
  );
}
