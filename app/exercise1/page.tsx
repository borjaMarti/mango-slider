import { RangeShowcase } from "@/components/range-showcase";
import { Range } from "@/components/ui/range";
import { getLimits } from "@/lib/api";

export default async function Exercise1Page() {
  const res = await getLimits();

  return (
    <RangeShowcase>
      <Range
        min={res.ok ? res.data.min : 1}
        max={res.ok ? res.data.max : 100}
      />
    </RangeShowcase>
  );
}
