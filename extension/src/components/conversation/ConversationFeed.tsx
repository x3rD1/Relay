import { useEffect, useRef } from "react";
import type { Interaction } from "../../hooks/useTranscriptAndPolicies";
import EmptyState from "./EmptyState";
import styles from "./ConversationFeed.module.css";
import PolicySuggestions from "../suggestion/PolicySuggestions";
import type { Section } from "../../types/section";

type ConversationFeedProps = {
  interactions: Interaction[];
  onSectionSelect: (section: Section, transcript: string) => void;
};

export default function ConversationFeed({
  interactions,
  onSectionSelect,
}: ConversationFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interactions]);

  if (interactions.length === 0) return <EmptyState />;

  return (
    <div>
      {interactions.map((interaction) => (
        <section key={interaction.id} className={styles.interaction}>
          <p className={styles.transcript}>
            <span className={styles.transcriptLabel}>Customer</span>
            {interaction.transcript}
          </p>

          {interaction.policyStatus === "loading" && (
            <p className={styles.status}>Finding relevant policies...</p>
          )}

          {interaction.policyStatus === "success" &&
            interaction.policies.length === 0 && (
              <p className={styles.status}>
                No relevant policies found for this message.
              </p>
            )}

          {interaction.policyStatus === "success" &&
            interaction.policies.length > 0 && (
              <PolicySuggestions
                interaction={interaction}
                onSectionSelect={onSectionSelect}
              />
            )}

          {interaction.policyStatus === "error" && (
            <p className={`${styles.status} ${styles.error}`}>
              Couldn't retrieve policy suggestions.
            </p>
          )}
        </section>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
