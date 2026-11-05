import ConversationFeed from "../../conversation/ConversationFeed";
import styles from "../Overlay.module.css";
import type { Interaction } from "../../../hooks/useTranscriptAndPolicies";
import type { Section } from "../../../types/section";
import { useRef, useState } from "react";
import SectionDetail from "./SectionDetail";

interface PanelProps {
  interactions: Interaction[];
  onMinimize: () => void;
}

type SelectedSection = {
  section: Section;
  transcript: string;
};

export default function Panel({ interactions, onMinimize }: PanelProps) {
  const [selectedSection, setSelectedSection] =
    useState<SelectedSection | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const handleSectionSelect = (section: Section, transcript: string) => {
    scrollPositionRef.current = contentRef.current?.scrollTop ?? 0;
    setSelectedSection({ section, transcript });
  };

  const handleBack = () => {
    setSelectedSection(null);

    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = scrollPositionRef.current;
      }
    });
  };
  return (
    <section aria-label="Relay knowledge assistant" className={styles.panel}>
      {selectedSection ? (
        <header className={styles.header}>
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to conversation"
            className={styles.iconButton}
          >
            ←
          </button>
        </header>
      ) : (
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
      )}

      <div ref={contentRef} className={styles.content}>
        <div className={selectedSection ? styles.hidden : styles.visible}>
          <ConversationFeed
            interactions={interactions}
            onSectionSelect={handleSectionSelect}
          />
        </div>

        <div className={selectedSection ? styles.visible : styles.hidden}>
          {selectedSection && (
            <SectionDetail
              section={selectedSection.section}
              transcript={selectedSection.transcript}
            />
          )}
        </div>
      </div>
    </section>
  );
}
