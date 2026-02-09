import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.login);
export const AuthRoute = router;