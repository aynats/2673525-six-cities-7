import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { resolve } from 'node:path';
import { injectable } from 'inversify';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const destination = resolve(process.cwd(), 'logs', 'rest.log');

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          level: 'debug',
          options: {
            destination,
            mkdir: true,
          }
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug({}, message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info({}, message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn({}, message, ...args);
  }
}
