import { User } from "../../../DB/models/user.js";
import { Token } from "../../../DB/models/token.js";
import { Task } from "../../../DB/models/task.js";
import { asyncHandler } from "../../../util/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../../../util/sendEmail.js";

//1-signUp
export const signUp = asyncHandler(async (req, res, next) => {
  let { username, email, password, confirmPassword, age, gender, phone } =
    req.body;

  // check user
  let user = await User.findOne({ email });
  console.log(user);

  if (user) return next(new Error("user is already exists!!", { cause: 400 }));

  // check password confirmation
  if (password !== confirmPassword)
    return next(
      new Error("passwords ara not match each other!!", { cause: 400 })
    );

  // hash password
  let hashPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  // add user
  await User.create({
    username,
    email,
    password: hashPassword,
    age,
    gender,
    phone,
  });

  //Token
  const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SECRET);
  const html = `<a href = "http://localhost:3000/auth/activateAccount/${token}">press here to activate your account</a>`;
  // send email
  const isSent = await sendEmail({
    to: req.body.email,
    subject: "Account activation",
    html,
  });

  if (!isSent) return next(new Error("message not sent", { cause: 400 }));
  //response
  return res
    .status(201)
    .json({ success: true, message: "user Added successfully" });
});

//2-signIn
export const signIn = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });

  console.log(user);
  if (!user || user.isDeleted == true)
    return next(new Error("user does not exists!", { cause: 404 }));

  if (!user.isActivated)
    return next(new Error("this account is not activated !!", { cause: 400 }));

  let isMatch = bcryptjs.compareSync(password, user.password);
  console.log(isMatch);
  if (!isMatch) return next(new Error("invalid password", { cause: 401 }));

  // generate token
  let token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_SECRET
  );

  // add token to collection
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  return res.status(200).json({
    success: true,
    message: `welcome ${user.username}`,
    token,
  });
});

//3-activate account
export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  // decode token
  const payLoad = jwt.verify(token, process.env.TOKEN_SECRET);

  console.log(payLoad);

  // check user
  const user = await User.findOne({ email: payLoad.email });
  if (!user) return next(new Error("user is not exist !!", { cause: 400 }));

  // change activation state to true
  user.isActivated = true;
  await user.save();

  return res.json({
    success: true,
    message: "account activated successfully you can sign in now",
  });
});

//4-changePassword
export const changePassword = asyncHandler(async (req, res, next) => {
  let { oldPassword, newPassword, confirmNewPassword } = req.body;
  let { token } = req.headers;
  let user = req.user;
  console.log(user);
  let isMatch = bcryptjs.compareSync(oldPassword, user.password);
  console.log(isMatch);
  if (!isMatch) return next(new Error("invalid password !!", { cause: 401 }));

  if (newPassword !== confirmNewPassword)
    return next(new Error("passwords must match!!", { cause: 400 }));

  let newPasswordHash = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  user.password = newPasswordHash;
  user.save();
  token = token.split(process.env.BEARER_KEY)[1];
  await Token.findOneAndUpdate({ token }, { isValid: false });
  return res
    .status(200)
    .json({ success: true, message: "password changed successfully" });
});

//5-updateUser
export const updateUser = asyncHandler(async (req, res, next) => {
  let { username, age } = req.body;
  let user = req.user;
  console.log(user);
  user.username = username;
  user.age = age;
  user.save();
  return res
    .status(200)
    .json({ success: true, message: "user updated successfully" });
});

//6-deleteUser
export const deleteUser = asyncHandler(async (req, res, next) => {
  let user = req.user;
  let { token } = req.headers;
  let response = await User.deleteOne(user._id);

  // delete all tasks belonges to this user
  await Task.deleteMany({ userId: user._id });

  // destroy token
  token = token.split(process.env.BEARER_KEY)[1];
  await Token.findOneAndUpdate({ token }, { isValid: false });

  if (response.deletedCount == 1)
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
});

//7-softDelete
export const softDelete = asyncHandler(async (req, res, next) => {
  let user = req.user;
  let { token } = req.headers;
  user.isDeleted = true;
  user.save();

  // soft delete all tasks belongs to this user
  await Task.updateMany({ userId: user._id }, { isDeleted: true });

  // destroy token
  token = token.split(process.env.BEARER_KEY)[1];
  await Token.findOneAndUpdate({ token }, { isValid: false });

  console.log(user);
  if (user.isDeleted == true) {
    return res.status(200).json({
      success: true,
      message: "user deleted successfully you can recover it in 30 days",
    });
  }
});

//8-logout
export const logOut = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  console.log(token);
  token = token.split(process.env.BEARER_KEY)[1];
  console.log(token);
  await Token.findOneAndUpdate({ token }, { isValid: false });
  return res.status(200).json({ success: true, message: "user logged out" });
});
