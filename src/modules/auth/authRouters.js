import { Router } from "express";
import * as userControllers from "./authControllers.js";
import { authMiddleWare } from "../../middlewares/auth.js";
import * as validationSchemas from "../auth/authValidationSchemas.js";
import { validation } from "../../middlewares/validation.js";

let router = Router();

//1-signUp
router.post(
  "/signUp",
  validation(validationSchemas.signupSchema),
  userControllers.signUp
);

//2-activate Account
router.get(
  "/activateAccount/:token",
  validation(validationSchemas.tokenSchema),
  userControllers.activateAccount
);

//3-signIn
router.post(
  "/signIn",
  validation(validationSchemas.signinSchema),
  userControllers.signIn
);

//4-change password
router.patch(
  "/changePassword",
  authMiddleWare,
  validation(validationSchemas.changePasswordSchema),
  userControllers.changePassword
);

//5-updata user
router.patch(
  "/updateUser",
  authMiddleWare,
  validation(validationSchemas.updateUserSchema),
  userControllers.updateUser
);

//6-deleteUser
router.delete("/deleteUser", authMiddleWare, userControllers.deleteUser);

//7-softDelete
router.patch("/softDelete", authMiddleWare, userControllers.softDelete);

//8-logOut
router.post("/logOut", authMiddleWare, userControllers.logOut);

export default router;
