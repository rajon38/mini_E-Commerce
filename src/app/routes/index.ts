import { Router } from "express";
import { AuthRoute } from "../module/auth/auth.route";
import { ProductRoute } from "../module/product/product.route";
import { CartRoute } from "../module/cart/cart.route";
import { OrderRoute } from "../module/order/order.route";

const router = Router()

router.use("/auth", AuthRoute);
router.use("/products", ProductRoute);
router.use("/carts", CartRoute);
router.use("/orders", OrderRoute);

export const IndexRoute = router;