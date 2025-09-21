import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <Link href={"exercise1"} className={styles.buttonLink}>
            Exercise 1
          </Link>
        </li>
        <li>
          <Link href={"exercise2"} className={styles.buttonLink}>
            Exercise 2
          </Link>
        </li>
      </ul>
    </nav>
  );
}
