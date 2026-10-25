import { useEffect, useRef } from "react";
import type { Interaction } from "../../hooks/useTranscriptAndPolicies";
import EmptyState from "./EmptyState";
import styles from "./ConversationFeed.module.css";

export default function ConversationFeed({
  interactions,
}: {
  interactions: Interaction[];
}) {
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
              <div className={styles.suggestions}>
                <p className={styles.suggestionsLabel}>Suggested policies</p>

                {interaction.policies.map((policy) => (
                  <button
                    key={policy.id}
                    type="button"
                    className={styles.policyButton}
                    onClick={() => {
                      // API integration later
                    }}
                  >
                    {policy.name}
                  </button>
                ))}
              </div>
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
