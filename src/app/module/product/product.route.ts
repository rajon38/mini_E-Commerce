import { Router } from "express";
import { ProductController } from "./product.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/",ProductController.getAllProducts);
router.get("/:id", ProductController.getOneProduct);
router.post("/",checkAuth(Role.ADMIN), ProductController.createProduct);
router.patch("/:id",checkAuth(Role.ADMIN), ProductController.updateProduct);
router.delete("/:id",checkAuth(Role.ADMIN), ProductController.deleteProduct);

export const ProductRoute = router;