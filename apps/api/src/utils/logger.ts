import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          levelFirst: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined, // In production, we'll use standard JSON logging
  redact: {
    paths: ['*.password', '*.token', '*.key'], // Redact sensitive information
    remove: true,
  },
});

// Development-only logging wrapper
const devLogger = {
  debug: (obj: Record<string, unknown>, msg?: string) => {
    if (isDevelopment) {
      logger.debug(obj, msg);
    }
  },
};

export { logger, devLogger };
