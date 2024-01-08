import { skuAssignmentRouter } from "./skuAssignment.routes";

import express from "express";

const router = express.Router();

router.use(skuAssignmentRouter);

export { router as skuAssignmentRouter };
