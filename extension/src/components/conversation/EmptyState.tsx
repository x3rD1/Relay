import styles from "./EmptyState.module.css";

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">
        <span>↗</span>
      </div>

      <h3 className={styles.title}>Ready when you are</h3>

      <p className={styles.description}>
        Start listening to the call using the extension to see customer messages
        and relevant policy suggestions here.
      </p>
    </div>
  );
}
