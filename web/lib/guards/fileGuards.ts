export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function validateUploadedFile(file: unknown) {
  if (!file || !(file instanceof File)) {
    throw new HttpError(
      400,
      "Invalid file upload. Please provide a valid file payload.",
    );
  }

  if (file.type !== "application/pdf") {
    throw new HttpError(415, "Unsupported file type. File must be PDF.");
  }

  if (file.size === 0) {
    throw new HttpError(400, "Invalid file upload. File must have a content.");
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new HttpError(
      413,
      `File too large. Maximum size is ${maxBytes / 1024 / 1024}MB.`,
    );
  }
}
