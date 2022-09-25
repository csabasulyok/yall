import path from 'path';
import winston, { Logger } from 'winston';
import autoBind from 'auto-bind';
import extol from 'extol';

const projectRoot = path.join(__dirname, '..');

/**
 * Logger capable of printing caller filename and line
 */
export class Yall {
  @extol('info')
  yallLevel: string;

  @extol()
  yallFilename: string;

  @extol(true, { json: true })
  yallColored: boolean;

  @extol(true, { json: true })
  yallTimestamp: boolean;

  logger: winston.Logger;
  stackInfo = 'unknown';

  constructor() {
    const transports: winston.transport[] = [new winston.transports.Console()];
    if (this.yallFilename) {
      transports.push(new winston.transports.File({ filename: this.yallFilename }));
    }

    // winston formatters based on config
    const formatters = [
      this.yallColored && winston.format.colorize({ all: true }),
      this.yallTimestamp && winston.format.timestamp(),
      this.yallTimestamp &&
        winston.format.printf((info) => `${info.timestamp} {${this.stackInfo}} [${info.level}]: ${info.message}`),
      !this.yallTimestamp && winston.format.printf((info) => `{${this.stackInfo}} [${info.level}]: ${info.message}`),
    ].filter((f) => f);

    // configure Winston logger
    this.logger = winston.createLogger({
      level: this.yallLevel,
      format: winston.format.combine(...formatters),
      transports,
    });

    autoBind(this);
  }

  debug(arg: unknown): Logger {
    this.setStackInfo();
    return this.logger.debug(arg);
  }

  info(arg: unknown): Logger {
    this.setStackInfo();
    return this.logger.info(arg);
  }

  warn(arg: unknown): Logger {
    this.setStackInfo();
    return this.logger.warn(arg);
  }

  error(arg: unknown): Logger {
    this.setStackInfo();
    return this.logger.error(arg);
  }

  setStackInfo(): void {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    const stacklist = new Error().stack?.split('\n');

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[3] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
      const filename = path.relative(projectRoot, sp[2]);
      const line = Number(sp[3]);
      this.stackInfo = `${filename}:${line}`;
    } else {
      this.stackInfo = 'unknown';
    }
  }
}

/**
 * Default instace
 */
const yall = new Yall();
export default yall;
