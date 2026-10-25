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
      {dialogVisible ? (
        <Panel interactions={interactions} onMinimize={toggleDialog} />
      ) : (
        <Launcher onClick={toggleDialog} />
      )}
    </div>
  );
}
