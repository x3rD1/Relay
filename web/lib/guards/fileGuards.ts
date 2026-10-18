import { HttpError } from "@/errors";

export function validateUploadedFile(file: unknown) {
  if (!file || !(file instanceof File)) {
    throw new HttpError(
      "Invalid file upload. Please provide a valid file payload.",
      400,
    );
  }

  if (file.type !== "application/pdf") {
    throw new HttpError("Unsupported file type. File must be PDF.", 415);
  }

  if (file.size === 0) {
    throw new HttpError("Invalid file upload. File must have a content.", 400);
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new HttpError(
      `File too large. Maximum size is ${maxBytes / 1024 / 1024}MB.`,
      413,
    );
  }
}
