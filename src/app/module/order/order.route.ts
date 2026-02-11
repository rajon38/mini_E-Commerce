import { Router } from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/",checkAuth(Role.CUSTOMER, Role.ADMIN), OrderController.getAllOrders);
router.post("/",checkAuth(Role.CUSTOMER), OrderController.createOrder);
router.put("/:id",checkAuth(Role.CUSTOMER), OrderController.updateOrderById);
router.patch("/status/:id",checkAuth(Role.ADMIN), OrderController.orderStatusUpdate);
router.delete("/:id",checkAuth(Role.ADMIN), OrderController.deleteOrder);

export const OrderRoute = router;