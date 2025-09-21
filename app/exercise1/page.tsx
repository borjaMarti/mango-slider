import Slider from "@/components/ui/slider/slider";
import { getLimits } from "@/lib/api";
import styles from "./page.module.css";

export default async function Exercise1Page() {
  const res = await getLimits();

  return (
    <Slider min={res.ok ? res.data.min : 1} max={res.ok ? res.data.max : 100} />
  );
}
