import { getDocuments } from "../knowledge/documents";

export async function buildDocumentChoices() {
  const documents = await getDocuments(); // Later: Needs userId

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
