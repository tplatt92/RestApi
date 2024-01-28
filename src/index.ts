import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();
const URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
