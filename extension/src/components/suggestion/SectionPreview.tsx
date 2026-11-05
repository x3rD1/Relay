import type { Section } from "../../types/section";
import styles from "./SectionPreview.module.css";

type SectionPreviewProps = {
  section: Section;
  transcript: string;
  onSectionSelect: (section: Section, transcript: string) => void;
};

export default function SectionPreview({
  section,
  transcript,
  onSectionSelect,
}: SectionPreviewProps) {
  return (
    <button
      type="button"
      className={styles.sectionPreview}
      onClick={() => onSectionSelect(section, transcript)}
    >
      <span className={styles.sectionTitle}>{section.title}</span>

      <span className={styles.sectionContent}>{section.content}</span>

      <span className={styles.sectionAction}>
        View section <span aria-hidden="true">›</span>
      </span>
    </button>
  );
}
