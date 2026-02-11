import { Router } from "express";
import { CartController } from "./cart.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.post("/",checkAuth(Role.CUSTOMER), CartController.createUpdateCart);
router.get("/",checkAuth(Role.CUSTOMER), CartController.getCart);
router.delete("/item/:id",checkAuth(Role.CUSTOMER), CartController.deleteCartItem);

export const CartRoute = router;