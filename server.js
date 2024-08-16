const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const bootcamp = require("./routes/bootcamps");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB(); // connect to database

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use(logger);
app.use("/api/v1/bootcamps", bootcamp);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log(PORT);

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error : ${error.message}`);
  server.close(() => process.exit(1));
});
