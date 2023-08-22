import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import http from "http";

import router from "./routes/route";

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join("public"), { maxAge: 172800000 }));

app.use("/", router);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
