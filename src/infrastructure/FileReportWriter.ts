import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { mkdir } from 'fs/promises';

/**
 * FileReportWriter
 * Writes Markdown report content to a file.
 */
export class FileReportWriter {
  async write(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = dirname(filePath);
      await mkdir(dir, { recursive: true });

      // Write file
      await writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write report to ${filePath}: ${error}`);
    }
  }
}
