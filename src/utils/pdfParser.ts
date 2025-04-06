import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import ApiError from './ApiError';

/**
 * Parses a PDF document and returns its content if not too large
 * @param filePath Path to the PDF file
 * @returns Document content or error message
 * @throws ApiError if document processing fails
 */
async function parseDocument(filePath: string): Promise<string> {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // Check if document is too large
    if (docs.length > 5) {
      throw new ApiError(413, 'document too large');
    }

    // Combine content from all pages
    const allContent = docs.map((doc) => doc.pageContent).join('\n\n');
    return allContent;
  } catch (error) {
    // If error is already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Otherwise wrap in ApiError with appropriate status code
    throw new ApiError(
      500,
      `Error parsing document: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export default parseDocument;
