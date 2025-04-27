import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/MongoDB.js";
import authRoutes from "./routes/authRoute.js";
import assessmentFramework from "./routes/assessmentFrameworkRoutes.js";
import search from "./routes/searchRoute.js";
import stats from "./routes/statsRoutes.js";
import downloadRep from "./routes/downloadReport.js";
import evaluate from "./routes/evaluateRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/assessment-framework", assessmentFramework);
app.use("/api/evaluate", evaluate);
app.use("/api/stats", stats);
app.use("/api/search", search);
app.use("/api/downloadReport", downloadRep);
app.use("/api/student", studentRoutes);
app.use("/api/section", sectionRoutes);

app.listen(PORT, () => {
  console.log("connected to PORT: " + PORT);
  connectDB();
});
