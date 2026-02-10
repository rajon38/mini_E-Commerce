import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/profile",checkAuth(Role.CUSTOMER, Role.ADMIN), AuthController.getProfile);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.login);
router.patch("/profile", checkAuth(Role.CUSTOMER, Role.ADMIN), AuthController.updateProfile);
router.delete("/:id", checkAuth(Role.ADMIN), AuthController.deleteUser);
export const AuthRoute = router;