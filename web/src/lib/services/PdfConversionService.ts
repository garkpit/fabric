import pdf2md from '@opendocsg/pdf2md';
import * as pdfjs from 'pdfjs-dist';

export class PdfConversionService {
  constructor() {
    if (typeof window !== 'undefined') {
      console.log('PDF.js version:', pdfjs.version);
      const workerUrl = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
      );
      console.log('Worker URL:', workerUrl.href);
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.href;
      console.log('Worker configuration complete');
    }
  }

  async convertToMarkdown(file: File): Promise<string> {
    console.log('Starting PDF conversion:', {
      fileName: file.name,
      fileSize: file.size
    });

    const buffer = await file.arrayBuffer();
    console.log('Buffer created:', buffer.byteLength);

    try {
      // Using the @opendocsg/pdf2md library instead
      const markdown = await pdf2md(buffer, {
        pageParsed: (pages) => {
          console.log('Page parsed:', {
            pageCount: pages.length
          });
        },
        documentParsed: (document, pages) => {
          console.log('Document parsed:', {
            numPages: document.numPages,
            totalItems: pages.reduce((acc, page) => acc + page.items.length, 0)
          });
        }
      });
      
      console.log('Conversion complete:', {
        length: markdown.length,
        preview: markdown.substring(0, 100)
      });

      return markdown;
    } catch (error) {
      console.error('Error converting PDF to markdown:', error);
      throw error;
    }
  }
}

    






