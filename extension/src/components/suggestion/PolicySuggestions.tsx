import { useState } from "react";
import type { Interaction } from "../../hooks/useTranscriptAndPolicies";
import styles from "./PolicySuggestions.module.css";
import type { Section } from "../../types/section";
import { retrievePolicySections } from "../../services/retrievePolicySections";
import SectionPreview from "./SectionPreview";

export default function PolicySuggestions({
  interaction,
}: {
  interaction: Interaction;
}) {
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);
  const [sectionsByPolicy, setSectionsByPolicy] = useState<
    Record<string, Section[]>
  >({});
  const [loadingPolicyIds, setLoadingPolicyIds] = useState<Set<string>>(
    new Set(),
  );
  const [policyErrors, setPolicyErrors] = useState<Record<string, string>>({});

  const loadPolicySections = async (question: string, policyId: string) => {
    // Exit early if policy's sections already exists
    if (sectionsByPolicy[policyId]) {
      return;
    }

    try {
      setLoadingPolicyIds((current) => new Set(current).add(policyId));

      // Clears any previous error for this policy
      setPolicyErrors((current) => {
        const updated = { ...current };
        delete updated[policyId];
        return updated;
      });

      const policySections = await retrievePolicySections(question, policyId);

      setSectionsByPolicy((current) => ({
        ...current,
        [policyId]: policySections,
      }));
    } catch (error) {
      console.error("Failed to retrieve policy sections:", error);

      setPolicyErrors((current) => ({
        ...current,
        [policyId]: "Failed to retrieve sections.",
      }));
    } finally {
      setLoadingPolicyIds((current) => {
        const updated = new Set(current);
        updated.delete(policyId);
        return updated;
      });
    }
  };

  const togglePolicy = (policyId: string) => {
    setExpandedPolicyId((currentId) =>
      currentId === policyId ? null : policyId,
    );
  };

  // Combines both togglePolicy and loadPolicySections into a one function
  const handlePolicyClick = (policyId: string) => {
    togglePolicy(policyId);
    loadPolicySections(interaction.transcript, policyId);
  };

  return (
    <div className={styles.suggestions}>
      <p className={styles.suggestionsLabel}>Suggested policies</p>

      {interaction.policies.map((policy) => {
        const isExpanded = expandedPolicyId === policy.id;
        const isLoading = loadingPolicyIds.has(policy.id);
        const sections = sectionsByPolicy[policy.id];
        const error = policyErrors[policy.id];

        return (
          <div key={policy.id} className={styles.policy}>
            <button
              type="button"
              className={styles.policyButton}
              onClick={() => handlePolicyClick(policy.id)}
              disabled={isLoading}
            >
              {policy.name}
            </button>

            {/* Loading state */}
            {isExpanded && isLoading && (
              <p className={styles.loading}>Finding relevant sections...</p>
            )}

            <div
              className={`${styles.dropdown} ${isExpanded && sections ? styles.open : ""}`}
            >
              <div className={styles.dropdownContent}>
                {sections?.map((section) => (
                  <SectionPreview key={section.id} section={section} />
                ))}

                {error && <p role="alert">{error}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
