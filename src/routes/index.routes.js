import { Router } from "express";
import viewsRoutes from "./view.routes.js"
import productsRoutes from "./products.routes.js"
import cartRoutes from "./carts.routes.js"
import sesionsRoutes from "./sesions.routes.js"
import mocksRoutes from "./mocks.routes.js"
import usersRoutes from "./users.routes.js"

const router = Router();

router.use("/", viewsRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/carts", cartRoutes)
router.use("/api/sessions", sesionsRoutes)
router.use("/api/mocks", mocksRoutes)
router.use("/api/users", usersRoutes)

export default router;
