import axios from 'axios';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import chalk from 'chalk';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;

  private async load(url: string) {
    try {
      const response = await axios.get<MockServerData>(url);
      this.initialData = response.data;
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number): Promise<void> {
    if (!this.initialData) {
      throw new Error('Initial data was not loaded');
    }

    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }

    await tsvFileWriter.close();
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (!filepath || !url) {
      console.error(chalk.red('Error: expected arguments <n> <filepath> <url>'));
      console.error(chalk.gray('Usage: main.cli.js --generate <n> <filepath> <url>'));
      return;
    }

    if (!Number.isFinite(offerCount) || offerCount <= 0) {
      console.error(chalk.red(`Error: invalid count "${count}". Expected positive integer.`));
      return;
    }

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.green(`File ${filepath} was created with ${offerCount} offers!`));
    } catch (error: unknown) {
      console.error(chalk.red('Can\'t generate data'));
      console.error(chalk.gray(getErrorMessage(error)));
    }
  }
}
