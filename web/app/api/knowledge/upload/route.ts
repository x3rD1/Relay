import { HttpError, validateUploadedFile } from "@/lib/guards/fileGuards";
import { createDocument } from "@/lib/knowledge/documents";
import { organizeDocument } from "@/lib/upload/organize";
import { extractPdfText } from "@/lib/upload/pdf";
import { documentNameSchema } from "@/lib/upload/schema";
import z from "zod";

export async function POST(request: Request) {
  try {
    const formData: FormData = await request.formData();
    const file = formData.get("file");

    validateUploadedFile(file);

    const validatedFile = file as File;
    const buffer = Buffer.from(await validatedFile.arrayBuffer());

    const pdfContentAsText: string = await extractPdfText(buffer);

    if (!pdfContentAsText.trim()) {
      return Response.json(
        {
          error: "Unable to extract text. Scanned PDFs are not supported.",
        },
        { status: 400 },
      );
    }

    const organizedText = await organizeDocument(pdfContentAsText);

    const name = formData.get("name");
    const validatedName = documentNameSchema.parse({ name });

    await createDocument({ name: validatedName.name, data: organizedText });

    return new Response(null, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }

    console.error(error);

    if (error instanceof HttpError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
