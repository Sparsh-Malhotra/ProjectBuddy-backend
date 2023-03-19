import User from "../models/User.js";
import UserDetails from "../models/UserDetails.js";
import { userDetailsValidation } from "../utils/validation.js";

export const submitDetails = async (req, res) => {
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
};

export const updateDetails = async (req, res) => {
  const { id } = req.params;
  const requestBody = req.body;

  try {
    UserDetails.updateOne({ userId: id }, { ...requestBody }, (err, docs) => {
      if (err) res.status(400).send(err);
      else {
        res.send({ message: "Success" });
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getDetails = async (req, res) => {
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
};

export const getBuddies = async (req, res) => {
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
            { userId: { $ne: userId } },
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
    myAggregate = UserDetails.aggregate([
      {
        $match: { userId: { $ne: userId } },
      },
    ]);
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
};

export const getBuddyById = async (req, res) => {
  try {
    const { buddyId } = req.params;
    const user = await UserDetails.findOne({ userId: buddyId });
    const avatar_url = await User.findOne(
      { _id: buddyId },
      { avatar_url: 1, _id: 0 }
    );
    if (!user || !avatar_url) {
      return res
        .status(404)
        .json({ msg: "Can't find user, please check the id!!" });
    }
    res.send({
      message: "Success",
      data: { ...user._doc, ...avatar_url._doc },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
