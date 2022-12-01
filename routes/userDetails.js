const router = require("express").Router();
const UserDetails = require("../models/UserDetails");
const verifyToken = require("../utils/verifyToken");
const { userDetailsValidation } = require("../utils/validation");

router.post("/submit-details", verifyToken, async (req, res) => {
  //   res.send(req.user);
  const { error } = userDetailsValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: "error", errorDetails: error.details[0].message });

  const userDetails = new UserDetails({ ...req.body, userId: req.user._id });
  try {
    const savedDetails = await userDetails.save();
    res.send({ message: "Success" });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/get-details", verifyToken, async (req, res) => {
  const details = await UserDetails.findOne({ userId: req.user._id });
  if (!details)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Email does not exist" });

  res.send({ message: "Success", data: details });
});

module.exports = router;
