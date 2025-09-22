import { SliderShowcase } from "@/components/slider-showcase";
import { Slider } from "@/components/ui/slider";
import { getRange } from "@/lib/api";

export default async function Exercise2Page() {
  const res = await getRange();

  return (
    <SliderShowcase>
      <Slider
        fixedValues={
          res.ok ? res.data.range : [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
        }
      />
    </SliderShowcase>
  );
}
