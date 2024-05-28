const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const otpRoute = require("./routes/user");
const propertyDetails = require("./routes/propertyDetails");

const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

// ----- Mongoose connection ------
mongoose
  .connect(`mongodb+srv://kunalkhelkar2000:ch6YFrttRUfOgyKP@cluster01.ftbc18n.mongodb.net/`)
  .then(() => {
    console.log("MongoDB connected Successfully");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded images statically
app.use("/api/uploads", express.static("uploads"));
// app.use("/api/uploads", propertyDetails);

app.use("/api/auth", authRoute);
app.use("/api/property", propertyDetails);
app.use("/api/otp", otpRoute);
app.get("/check", async (req, res) => {
  res.send("Working fine");
});

app.get("/check2", async (req, res) => {
  res.send("HEllo world");
});
app.listen(4000, () => {
  console.log("Server is Running on:4000");
});
