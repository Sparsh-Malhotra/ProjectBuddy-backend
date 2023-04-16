import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { registerValidation, loginValidation } from "../utils/validation.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  //Body Validation
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: "error", errorDetails: error.details[0].message });

  //Check if user email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Email already exists" });

  //Hashing the password
  const hashedPassword = await hashPassword(req.body.password);

  const name = req.body.name.split(" ");
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    avatar_url: `https://api.dicebear.com/5.x/initials/svg?seed=${name.join(
      "+"
    )}?size=140?backgroundType=gradientLinear`,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET_KEY);
    res.send({ ...savedUser, authToken: token });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const login = async (req, res) => {
    //Body Validation
    const { error } = loginValidation(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: "error", errorDetails: error.details[0].message });
  
    //Check if user email does not exists
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
    res.send({
      message: "Success",
      data: { name: user.name, email: user.email },
      authToken: token,
    });
  }

  const hashPassword = async (password, saltRounds = 10) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.log(error);
    }
    return null;
  };