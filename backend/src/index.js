import express from "express";
import "dotenv/config";
import cors from "cors";
import job from "./lib/cron.js";


import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";
const app = express();
const PORT = process.env.PORT;


job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);

app.listen (PORT, () => {
    console.log(`El servidor se esta corriendo en el puerto ${PORT}`);
    connectDB();
});
