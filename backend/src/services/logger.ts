import chalk from "chalk";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogFn = (...args: unknown[]) => void;

export const log = {
  debug: (...args) => console.debug(chalk.gray(...args)),
  info: (...args) => console.log(chalk.blue(...args)),
  warn: (...args) => console.warn(chalk.yellow(...args)),
  error: (...args) => {
    if (args.length === 1) return console.error("❌ Error:", args);
    else return console.error(...args);
  },
} satisfies Record<LogLevel, LogFn>;
