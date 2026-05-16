import axios from "axios";
import { TEST_SERVER_URL } from "./constants";
import { LogLevel, LogPayload, LogStack } from "./types";

export async function Log(
  stack: LogStack,
  level: LogLevel,
  packageName: string,
  message: string
): Promise<void> {
  const payload: LogPayload = {
    stack,
    level,
    packageName,
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(TEST_SERVER_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    /**
     * Intentionally avoiding console.log
     * Silent fail or future local persistence can be added here
     */
  }
}