import type { Section } from "../../types/section";
import styles from "./SectionPreview.module.css";

export default function SectionPreview({ section }: { section: Section }) {
  return (
    <button type="button" className={styles.sectionPreview}>
      <span className={styles.sectionTitle}>{section.title}</span>

      <span className={styles.sectionContent}>{section.content}</span>

      <span className={styles.sectionAction}>
        View section <span aria-hidden="true">›</span>
      </span>
    </button>
  );
}
