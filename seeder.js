const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" }); // load  env vars

const Bootcamp = require("./models/Bootcamp"); // load Bootcamp

mongoose.connect(process.env.MONGO_URI); //connect to db

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// import data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("data imported");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("data destroyed");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
