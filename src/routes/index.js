import { Router } from "express";
import viewsRoutes from "./view.routes.js"
import productsRoutes from "./products.routes.js"
import cartRoutes from "./carts.routes.js"

const router = Router();

router.use("/", viewsRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/carts", cartRoutes)

export default router;
