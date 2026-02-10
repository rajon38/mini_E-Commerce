import { Router } from "express";
import { AuthRoute } from "../module/auth/auth.route";
import { ProductRoute } from "../module/product/product.route";

const router = Router()

router.use("/auth", AuthRoute);
router.use("/products", ProductRoute);

export const IndexRoute = router;