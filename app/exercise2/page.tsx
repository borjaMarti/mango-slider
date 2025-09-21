import Slider from "@/components/ui/slider/slider";
import { getRange } from "@/lib/api";
import styles from "./page.module.css";

export default async function Exercise2Page() {
  const res = await getRange();

  return (
    <Slider
      fixedValues={
        res.ok ? res.data.range : [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
      }
    />
  );
}
