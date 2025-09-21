import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href={"example1"}>Example 1</Link>
        </li>
        <li>
          <Link href={"example2"}>Example 2</Link>
        </li>
      </ul>
    </main>
  );
}
