import express from "express";
import { authRouter } from "./Auth";
import { skuAssignmentRouter } from "./SkuAssignment";
const router = express.Router();

const allRoutes = [
  {
    path: "/v1/api/auth",
    route: authRouter,
  },
  {
    path: "/v1/api/skuAssignment",
    route: skuAssignmentRouter,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export { router };
