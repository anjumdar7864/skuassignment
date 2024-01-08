import express from "express";
import { skuAssignmentController } from "../../controllers";

const router = express.Router();

router.get("/current-stock", skuAssignmentController.currentStock);
export { router as skuAssignmentRouter };
