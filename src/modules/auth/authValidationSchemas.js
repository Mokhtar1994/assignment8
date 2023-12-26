import joi from "joi";
import * as validationErrors from "../../../util/validationErrorsMessages.js";

// signup schema
export const signupSchema = joi
  .object({
    //username
    username: joi
      .string()
      .alphanum()
      .required()
      .messages(validationErrors.usernameErrors),
    //email
    email: joi
      .string()
      .email()
      .required()
      .messages(validationErrors.emailErrors),
    //password
    password: joi.string().required().messages(validationErrors.passwordErrors),
    //age
    age: joi.number().required().messages(validationErrors.ageErrors),
    //gender
    gender: joi
      .string()
      .valid("male", "female")
      .messages(validationErrors.genderErrors),
    //phone
    phone: joi
      .string()
      .pattern(/^01[0-2,5]\d{8}$/)
      .required()
      .messages(validationErrors.phoneErrors),
    // confirm password
    confirmPassword: joi
      .valid(joi.ref("password"))
      .required()
      .messages(validationErrors.confirmPassword),
  })
  .required()
  .unknown();

// signin schema
export const signinSchema = joi
  .object({
    //email
    email: joi
      .string()
      .email()
      .required()
      .messages(validationErrors.emailErrors),
    //password
    password: joi.string().required().messages(validationErrors.emailErrors),
  })
  .required();

//change password schema
export const changePasswordSchema = joi
  .object({
    //old password
    oldPassword: joi
      .string()
      .required()
      .messages(validationErrors.passwordErrors),
    //new password
    newPassword: joi.string().required().messages(validationErrors.newPassword),
    //confirm new password
    confirmNewPassword: joi
      .string()
      .required()
      .valid(joi.ref("newPassword"))
      .messages(validationErrors.confirmPassword),
  })
  .required();

//update user
export const updateUserSchema = joi
  .object({
    username: joi
      .string()
      .alphanum()
      .required()
      .messages(validationErrors.usernameErrors),
    age: joi.number().required().messages(validationErrors.ageErrors),
  })
  .required();

//token schema
export const tokenSchema = joi
  .object({
    token: joi.string().required().messages(validationErrors.tokenErrors),
  })
  .required();
