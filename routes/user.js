const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { log } = require("console");
// const jwt = require("js");
const Questions = require("../model/Questions.js");
const localStorage = require("node-localstorage");

router.get("/signup", (req, res) => {
  res.render("html/signup");
});
router.get("/profile", async (req, res) => {
  try {
    let username = req.query.user;

    if (typeof username !== "string") {
      return res.status(400).send("Invalid username parameter");
    }

    // Decode URL-encoded characters
    username = decodeURIComponent(username);

    // Clean the username from unwanted characters, spaces, and quotes
    username = username
      .replace(/^\s+|\s+$/g, "") // Trim leading and trailing whitespace
      .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular spaces
      .replace(/['"]+/g, ""); // Remove single and double quotes
    username = username.trim();
    console.log(`Cleaned username value: "${username}"`);

    if (!username) {
      return res.status(400).send("Username query parameter is required");
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("html/profile", { user: user });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/leader", (req, res) => {
  res.render("html/leader");
});

router.get("/index", async (req, res) => {
  try {
    // Fetch all questions
    const questions = await Questions.find();

    // Log the cookie for debugging purposes
    console.log("im in index");

    // Fetch the user from the query parameters
    let user = req.query.user;
    req.user = user;
    // Render the template with questions and user data
    res.render("html/index", { questions, user });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    log("user");
    let { username, email, password } = req.body;
    const score = 0;
    log(username);
    password = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password, score });
    await newUser.save();
    res.redirect("/user/login");
  } catch (error) {
    return res.json("error creating user " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password)
      req.redirect("/user/login?message = username and password are required ");
    const user = await User.findOne({ username: username });
    if (!user) {
      res.redirect("/user/login?message = invalid username");
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.user = user;
      res.cookie("user", user, { maxAge: 8400 });

      res.redirect("/user/index?user= " + user.username);
    }
  } catch (error) {
    return res.json("error creating user " + error.message);
  }
});

router.get("/login", async (req, res) => {
  const message = req.query.message;
  res.render("html/login", { message });
});
module.exports = router;
