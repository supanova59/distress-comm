import express from "express";
import dotenv from "dotenv";
import callsRouter from "./routes/calls.route.js";
import connectDB from "./connection.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 8000;
const API_PATH = process.env.API_PATH;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());

app.use(`${API_PATH}/calls`, callsRouter);

connectDB(MONGODB_URI).then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}...`);
	});
});
