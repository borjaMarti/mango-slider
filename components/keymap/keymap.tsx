import { Fragment } from "react";
import styles from "./keymap.module.css";

const keymapData = [
  { keys: ["Tab", "Shift + Tab"], description: "Cycle through thumbs." },
  { keys: ["↑", "→"], description: "Next step." },
  { keys: ["↓", "←"], description: "Previous step." },
  { keys: ["Home"], description: "Min value." },
  { keys: ["End"], description: "Max value." },
];

export default function Keymap() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Keymap</h2>
      <div className={styles.grid}>
        {keymapData.map((item) => (
          <Fragment key={item.description}>
            <div className={styles.keys}>
              {item.keys.map((key, index) => (
                <Fragment key={key}>
                  <kbd className={styles.key}>{key}</kbd>
                  {index < item.keys.length - 1 && <span> / </span>}
                </Fragment>
              ))}
            </div>
            <p>{item.description}</p>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
