const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const http = require("http");
const app = express();
const httpServer = http.createServer(app);


const searchRouter = require("./src/index");
const { initializeElasticsearch } = require("./libs/elasticsearch");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"
    ],
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());

app.use(searchRouter);

app.get("/", (req, res) => {
  res.send(" Backend API");
});


initializeElasticsearch().then(() => {
  console.log("Elasticsearch index initialized");
}).catch((err) => {
  console.error("Error initializing Elasticsearch index:", err);
  if (err.meta && err.meta.body) {
    console.error("Elasticsearch error details:", err.meta.body);
  }
});


const port = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGOCONNECTIONSTRING, {
  })
  .then(() => {
    console.log("Connected to MongoDB");
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;
