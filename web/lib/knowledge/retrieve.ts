export function retrieveRelevantText(documentText: string, question: string) {
  const paragraphs = documentText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const keywords = question
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2);

  const scoredParagraphs = paragraphs.map((paragraph) => {
    const text = paragraph.toLowerCase();

    const score = keywords.filter((keyword) => text.includes(keyword)).length;

    return { paragraph, score };
  });

  scoredParagraphs.sort((a, b) => b.score - a.score);

  return scoredParagraphs
    .filter((item) => item.score > 0)
    .slice(0, 3)
    .map((item) => item.paragraph);
}
