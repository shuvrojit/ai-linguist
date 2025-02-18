import { addColors, createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Logger } from 'winston';

/**
 * Logger Configuration and Setup
 *
 * This module configures Winston logger with different log levels and formats for
 * development and production environments.
 *
 * Log Levels (in order of severity):
 * - error: 0 (highest priority)
 * - warn: 1
 * - info: 2
 * - http: 3
 * - debug: 4 (lowest priority)
 *
 * Features:
 * - Color-coded console output in development
 * - JSON formatting in production
 * - Daily rotating file logs
 * - Separate error log file
 * - Exception handling
 */

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

addColors(logLevels.colors);

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Winston logger instance with the following configurations:
 *
 * Production:
 * - JSON formatted logs
 * - Daily rotating files with 14-day retention
 * - Separate error logs
 * - Exception tracking
 *
 * Development:
 * - Colorized console output
 * - Detailed formatting
 * - Debug level logging
 *
 * @example
 * ```typescript
 * import logger from './config/logger';
 *
 * // Usage
 * logger.info('Server started');
 * logger.error('Error occurred', error);
 * logger.debug('Debug information');
 * logger.http('Incoming request');
 * ```
 */
const logger: Logger = createLogger({
  levels: logLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isProduction ? format.json() : format.simple()
  ),
  transports: [
    new transports.Console({
      level: isProduction ? 'error' : 'debug',
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    new DailyRotateFile({
      level: 'info',
      filename: 'logs/api-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      handleExceptions: true,
    }),
    new transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
  exitOnError: false,
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
