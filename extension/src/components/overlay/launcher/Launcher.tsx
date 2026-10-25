import styles from "../Overlay.module.css";

interface LauncherProps {
  onClick: () => void;
}

export default function Launcher({ onClick }: LauncherProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Relay"
      className={styles.launcher}
    >
      <span aria-hidden="true">︿</span>
      <span>Show transcript</span>
    </button>
  );
}
