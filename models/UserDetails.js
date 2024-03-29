import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const userDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  age: {
    type: Number,
    required: true,
    min: 12,
    max: 100,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  university: {
    type: String,
    required: true,
    min: 3,
    max: 1024,
  },
  course: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  state: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  techStack: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  skills: {
    type: [String],
    default: [],
    required: false,
  },
  linkedin: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  github: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  twitter: {
    type: String,
    required: false,
    min: 3,
    max: 255,
  },
  dribble: {
    type: String,
    required: false,
    min: 3,
    max: 255,
  },
  about: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["student", "professional"],
  },
  userId: {
    type: String,
    required: true,
  },
});

userDetailsSchema.plugin(aggregatePaginate);

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;
