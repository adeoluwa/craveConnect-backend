import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
} as const;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

const logFormat = winston.format.printf((a) => {
  return `${a.timestamp} [${a.level.toUpperCase()}] : ${a.message}`;
});
winston.addColors(colors);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), logFormat),
  }),

  new DailyRotateFile({
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),
];

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports,
  levels,
});

export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
