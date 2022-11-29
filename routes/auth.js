const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //Body Validation
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: "error", errorDetails: error.details[0].message });
  if (error) return res.status(400).send();

  //Check if user email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Email already exists" });

  //Hashing the password
  const hashedPassword = await hashPassword(req.body.password);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Body Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user email already exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Email does not exist" });

  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Wrong Password" });

  //create and assign a jwt token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  res.header("auth-token", token).send({
    message: "Success",
    data: { name: user.name, email: user.email },
  });
});

const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }
  return null;
};

module.exports = router;
