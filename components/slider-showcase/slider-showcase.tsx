import { Keymap } from "../keymap";
import styles from "./slider-showcase.module.css";

export default function SliderShowcase({
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
