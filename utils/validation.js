import joi from 'joi';

export const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const userDetailsValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    age: joi.number().min(12).max(100),
    gender: joi.string().valid("male", "female"),
    university: joi.string().min(3).required(),
    course: joi.string().min(2).required(),
    state: joi.string().min(3).required(),
    techStack: joi.string().min(3).required(),
    skills: joi.array().items(joi.string()),
    linkedin: joi.string().uri(),
    github: joi.string().uri(),
    twitter: joi.string().uri(),
    dribble: joi.string().uri(),
  });
  return schema.validate(data);
};

