export type LogLevel =
  | "info"
  | "warn"
  | "error"
  | "debug"
  | "fatal";

export type LogStack =
  | "frontend"
  | "backend";

export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  packageName: string;
  message: string;
  timestamp: string;
}