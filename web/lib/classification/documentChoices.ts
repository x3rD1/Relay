import { getDocuments } from "../knowledge/documents";

export async function buildDocumentChoices(userId: string) {
  const documents = await getDocuments(userId);

  const documentChoices: Record<string, string> = Object.fromEntries(
    documents.map((document) => [
      document.name,
      document.sections.map((section) => section.title).join(", "),
    ]),
  );

  documentChoices["other"] =
    "Questions unrelated to any of the available knowledge documents";

  return { documentChoices, documents };
}
