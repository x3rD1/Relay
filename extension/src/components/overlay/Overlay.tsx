import { useDialogVisible } from "../../hooks/useDialogVisible";
import { useTranscriptAndPolicies } from "../../hooks/useTranscriptAndPolicies";
import styles from "./Overlay.module.css";
import Panel from "../overlay/panel/Panel";
import Launcher from "./launcher/Launcher";

export default function Overlay() {
  const { dialogVisible, toggleDialog } = useDialogVisible();
  const interactions = useTranscriptAndPolicies();

  if (dialogVisible === null) {
    return null;
  }

  return (
    <div className={styles.host}>
      <div className={dialogVisible ? styles.visible : styles.hidden}>
        <Panel interactions={interactions} onMinimize={toggleDialog} />
      </div>

      <div className={dialogVisible ? styles.hidden : styles.visible}>
        <Launcher onClick={toggleDialog} />
      </div>
    </div>
  );
}
