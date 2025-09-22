import { Keymap } from "../keymap";
import styles from "./range-showcase.module.css";

export default function RangeShowcase({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>{children}</div>
      <Keymap />
    </div>
  );
}
