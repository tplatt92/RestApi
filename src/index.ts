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

// Compression reduces the size of data sent over the network, improving the application's performance by reducing the amount of data that needs to be transferred.
app.use(compression());

// parses incoming HTTP requests and extracts any cookies included in the request headers.
app.use(cookieParser());

// parses incoming JSON payloads from HTTP requests and makes the data available in the req.body object.
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});

// ensures that Mongoose uses the native JavaScript promises, which are widely supported and consistent with the ECMAScript standard.
mongoose.Promise = Promise;

mongoose.connect(URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
