const router = require("express").Router();
const UserDetails = require("../models/UserDetails");
const User = require("../models/User");
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

  const avatar_url = await User.findOne(
    { _id: req.user._id },
    { avatar_url: 1, _id: 0 }
  );

  if (!details || !avatar_url)
    return res
      .status(400)
      .send({ message: "error", errorDetails: "Email does not exist" });

  res.send({
    message: "Success",
    data: { ...details._doc, ...avatar_url._doc },
  });
});

router.get("/get-buddies", verifyToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { searchString, techStack, location, skill, userId } = req.query;

  const filters = [];
  if (searchString) filters.push({ key: "searchString", value: searchString });
  if (techStack) filters.push({ key: "techStack", value: techStack });
  if (location) filters.push({ key: "location", value: location });
  if (skill) filters.push({ key: "skill", value: skill });

  const myCustomLabels = {
    totalDocs: "totalBuddies",
    docs: "buddies",
    limit: "perPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    hasPrevPage: "hasPrev",
    hasNextPage: "hasNext",
  };

  const options = {
    page,
    limit,
    customLabels: myCustomLabels,
  };

  const paramsTest = {};
  if (searchString)
    paramsTest["firstName"] = {
      $regex: new RegExp(searchString, "i"),
    };

  if (techStack)
    paramsTest["techStack"] = {
      $regex: new RegExp(techStack, "i"),
    };

  if (location)
    paramsTest["state"] = {
      $regex: new RegExp(location, "i"),
    };

  if (skill)
    paramsTest["skills"] = {
      $elemMatch: { $regex: new RegExp(skill, "i") },
    };

  let myAggregate;
  if (filters.length > 0) {
    myAggregate = UserDetails.aggregate([
      {
        $match: {
          $and: [
            { 'userId': { '$nin': [userId] } },
            {
              $text: {
                $search: `${filters.map((ele) => {
                  return ele.key === "searchString"
                    ? `${ele.value}^3 `
                    : `${ele.value}`;
                })}`,
              },
            },
            paramsTest,
          ],
        },
      },
    ]);
  } else {
    myAggregate = UserDetails.aggregate();
  }

  UserDetails.aggregatePaginate(myAggregate, options, function (err, result) {
    if (!err) {
      return res.send({
        success: true,
        result,
      });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
