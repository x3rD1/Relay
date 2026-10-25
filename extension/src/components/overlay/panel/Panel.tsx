import ConversationFeed from "../../conversation/ConversationFeed";
import styles from "../Overlay.module.css";
import type { Interaction } from "../../../hooks/useTranscriptAndPolicies";

interface PanelProps {
  interactions: Interaction[];
  onMinimize: () => void;
}

export default function Panel({ interactions, onMinimize }: PanelProps) {
  return (
    <section aria-label="Relay knowledge assistant" className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.title}>Customer transcript</span>

        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize Relay"
          className={styles.iconButton}
        >
          −
        </button>
      </header>

      <div className={styles.content}>
        <ConversationFeed interactions={interactions} />
      </div>
    </section>
  );
}
