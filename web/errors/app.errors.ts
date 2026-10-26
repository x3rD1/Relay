// Base class to allow errors to carry a specific HTTP status code
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// Custom error for missing sections (Returns a 404)
export class SectionNotFoundError extends HttpError {
  constructor() {
    super("Section not found.", 404);
    this.name = "SectionNotFoundError";
  }
}

// Custom error for missing documents (Returns a 404)
export class DocumentNotFoundError extends HttpError {
  constructor() {
    super("Document not found.", 404);
    this.name = "DocumentNotFoundError";
  }
}

export class VectorGenerationError extends HttpError {
  constructor(
    message = "Failed to generate vector embedding from the input text.",
  ) {
    super(message, 502);
    this.name = "VectorGenerationError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized access. Please log in.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class UserNotOnboardedError extends HttpError {
  constructor(message = "User authenticated but profile record not found.") {
    super(message, 403);
    this.name = "UserNotOnboardedError";
  }
}
