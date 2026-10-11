import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriter } from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    const writeSuccess = this.stream.write(`${row}\n`);
    if (!writeSuccess) {
      await new Promise<void>((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
  }

  public async close(): Promise<void> {
    if (this.stream.closed || this.stream.destroyed) {
      return;
    }
    
    return new Promise((resolve, reject) => {
      this.stream.on('error', reject);
      this.stream.on('finish', resolve);
      this.stream.end();
    });
  }
}
