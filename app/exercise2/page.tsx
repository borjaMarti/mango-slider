import { RangeShowcase } from "@/components/range-showcase";
import { Range } from "@/components/ui/range";
import { getRange } from "@/lib/api";

export default async function Exercise2Page() {
  const res = await getRange();

  return (
    <RangeShowcase>
      <Range
        fixedValues={
          res.ok ? res.data.range : [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
        }
      />
    </RangeShowcase>
  );
}
