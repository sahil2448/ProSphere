import { Router } from "express";
import { register, Login } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(Login);

export default router;
