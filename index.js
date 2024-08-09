const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Questionroute = require("./routes/question.js");
const Userroute = require("./routes/user.js");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const Check = require("./middleware/check.js");
const { log } = require("console");
let cookieParser = require("cookie-parser");
const User = require("./model/User.js");
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(Check);
app.use(express.static("public"));
app.use(express.static("images"));
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/question", Check, Questionroute);
app.use("/user", Userroute);

app.set("view engine", "ejs");
const port = process.env.PORT || 3006;
const db = process.env.db;

//home page
app.get("/", (req, res) => {
  res.render("html/start-quiz");
});

app.post("/updateUser", async (req, res) => {
  const { email, username } = req.body;
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's email and username
    user.email = email;
    user.username = username;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  mongoose
    .connect(db)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      log(`error connecting to db ${error.message}`);
    });
});
