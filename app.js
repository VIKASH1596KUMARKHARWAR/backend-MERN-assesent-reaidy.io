const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI PM Backend is running 🚀",
  });
});

// Mount versioned API
app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;

