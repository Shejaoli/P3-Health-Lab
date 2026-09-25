import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(publicRouter);

export default router;
