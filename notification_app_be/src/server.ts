import app from "./app";

import { Log } from "logging_middleware";

const PORT = 5000;

app.listen(PORT, async () => {
  await Log(
    "backend",
    "info",
    "server",
    `Server started on port ${PORT}`
  );
});