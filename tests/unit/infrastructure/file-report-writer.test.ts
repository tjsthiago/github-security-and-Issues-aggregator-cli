import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileReportWriter } from '../../../src/infrastructure/FileReportWriter';
import * as fs from 'fs/promises';

// Mock fs/promises
vi.mock('fs/promises');

describe('FileReportWriter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should write content to file', async () => {
    const mockMkdir = vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    const mockWriteFile = vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    const writer = new FileReportWriter();
    const filePath = '/path/to/report.md';
    const content = '# Test Report\n\nContent here';

    await writer.write(filePath, content);

    expect(mockMkdir).toHaveBeenCalledWith('/path/to', { recursive: true });
    expect(mockWriteFile).toHaveBeenCalledWith(filePath, content, 'utf-8');
  });

  it('should create directory if it does not exist', async () => {
    vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    const writer = new FileReportWriter();
    await writer.write('/new/directory/report.md', 'content');

    expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith('/new/directory', {
      recursive: true,
    });
  });

  it('should throw error when writeFile fails', async () => {
    const error = new Error('Permission denied');
    vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    vi.mocked(fs.writeFile).mockRejectedValueOnce(error);

    const writer = new FileReportWriter();

    await expect(writer.write('/path/report.md', 'content')).rejects.toThrow(
      'Failed to write report'
    );
  });

  it('should throw error when mkdir fails', async () => {
    const error = new Error('Permission denied');
    vi.mocked(fs.mkdir).mockRejectedValueOnce(error);

    const writer = new FileReportWriter();

    await expect(writer.write('/path/report.md', 'content')).rejects.toThrow(
      'Failed to write report'
    );
  });

  it('should handle absolute file path correctly', async () => {
    vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    const writer = new FileReportWriter();
    await writer.write('/absolute/path/to/report.md', 'content');

    expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith('/absolute/path/to', {
      recursive: true,
    });
  });

  it('should handle file in current directory', async () => {
    vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    const writer = new FileReportWriter();
    await writer.write('report.md', 'content');

    expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith('.', {
      recursive: true,
    });
  });

  it('should write UTF-8 encoded content', async () => {
    vi.mocked(fs.mkdir).mockResolvedValueOnce(undefined);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    const writer = new FileReportWriter();
    const content = '# Report\n\nWith special chars: áéíóú';

    await writer.write('/path/report.md', content);

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      '/path/report.md',
      content,
      'utf-8'
    );
  });
});
