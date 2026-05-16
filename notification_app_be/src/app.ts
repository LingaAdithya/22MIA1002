import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/loggerMiddleware";


import notificationRoutes from "./routes/notificationRoutes";

const app = express();

app.use(cors());

app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/v1/notifications", notificationRoutes);

export default app;