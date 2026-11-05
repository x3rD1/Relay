import { useState } from "react";
import type { Section } from "../../../types/section";
import styles from "./SectionDetail.module.css";

type SectionDetailProps = {
  section: Section;
  transcript: string;
};

export default function SectionDetail({
  section,
  transcript,
}: SectionDetailProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateResponse = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setResponse(null);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generate-response",
        question: transcript,
        sectionId: section.id,
      });

      if (!response.ok) {
        throw new Error(response.error);
      }

      setResponse(response.response);
    } catch (error) {
      console.error("Failed to generate response:", error);
      setGenerationError("Couldn't generate a response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <article className={styles.document}>
      <h1 className={styles.title}>{section.title}</h1>

      <div className={styles.content}>{section.content}</div>

      <div className={styles.responseActions}>
        <button
          type="button"
          onClick={handleGenerateResponse}
          disabled={isGenerating}
          className={styles.generateButton}
        >
          {isGenerating
            ? "Generating response..."
            : response
              ? "Regenerate response"
              : "Generate response"}
        </button>
      </div>

      {generationError && (
        <p role="alert" className={styles.error}>
          {generationError}
        </p>
      )}

      {response !== null && (
        <section className={styles.responseSection}>
          <h2 className={styles.responseTitle}>Suggested response</h2>

          <div className={styles.responseContent}>{response}</div>
        </section>
      )}
    </article>
  );
}
