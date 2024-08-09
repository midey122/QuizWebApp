const { log } = require("console");
const express = require("express");
const router = express.Router();
const Question = require("../model/Questions");
const User = require("../model/User");

router.get("/", async (req, res) => {
  const questions = await Question.find();
  if (questions.length <= 0) res.json("no  question");
  else res.json({ questions });
});
router.post("/", async (req, res) => {
  const { title, options, answer } = req.body;
  try {
    const newquestion = new Question({ title, options, answer });
    await newquestion.save();
  } catch (error) {
    log("error adding question " + error.message);
    return res.status(401).json("error adding questions");
  }
  res.json("question added successfully");
});
router.post("/mark", async (req, res) => {
  const useranswers = req.body;
  log(useranswers);
  const questions = await Question.find();
  let score = 0;
  questions.forEach((element) => {
    if (useranswers[element.title] === element.answer) {
      score += 1;
    }
  });
  useranswers.user = useranswers.user.trim();
  let currentuser = await User.findOne({ username: useranswers.user });
  currentuser.score = score;
  await currentuser.save();
  return res.redirect(`/user/profile?user=${currentuser.username}`)
});
router.post("/add", async (req, res) => {
  try {
    const { title, A, B, C, D, answer } = req.body;
    if (!title || !A || !B || !C || !D || !answer) {
      return res.redirect("/question/add?message=please include all fields");
    }
    const options = [A, B, C, D];
    const newquestion = Question({ title, options, answer });
    await newquestion.save();

    return res.redirect("/question/add?message=question added successfully");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/question/add?message=error adding question");
  }
});
router.get("/add", async (req, res) => {
  const message = req.params.message;

  return res.render("html/add", { message: message });
});

module.exports = router;
