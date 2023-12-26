///////////////////// user validation error messages ////////////////////////////
export const usernameErrors = {
  "string.base": "name must be a string",
  "string.alphanum": "name must contain only numbers or letters",
  "any.required": "username is required",
  "string.empty": "username not allowed to be empty",
};

export const emailErrors = {
  "string.base": "email must be a string",
  "string.email": "invalid email",
  "any.required": "email is required",
};
export const passwordErrors = {
  "string.base": "password must be a string",
  "any.required": "password is required",
};

export const ageErrors = {
  "number.base": "age must be a number",
  "any.required": "age is required",
};

export const genderErrors = {
  "string.base": "gender must be string",
  "any.only": "gender must be male or female only",
};

export const phoneErrors = {
  "string.base": "phone must be string",
  "string.pattern.base": "invalid phone number",
};

export const confirmPassword = {
  "any.only": "passwords must match each other",
  "any.required": "confirmed password is required",
};

export const newPassword = {
  "string.base": "new password must be a string",
  "any.required": "new password is required",
};

export const tokenErrors = {
  "string.base": "token must be a string",
  "any.required": "token is required",
};
////////////////////////////task validation error messages/////////////////////////////////////
export const titleError = {
  "string.base": "title must be a string",
};
export const descriptionError = {
  "string.base": "description must be string",
  "string.min": "the description error length must be greater than 5 character",
  "any.required": "description is required",
};

export const statusError = {
  "string.base": "status must be string",
  "any.only": "status must be one of these three values (toDo , doing , done)",
};

export const dateError = {
  "date.base": "invalid date please Enter date in this manner (year/month/day)",
};

export const taskIdError = {
  "any.required": "task Id is required",
};
