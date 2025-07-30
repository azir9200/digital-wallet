import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post("/", TransactionController.createTransaction);
router.get("/", TransactionController.getAllTransaction);
router.get("/:id", TransactionController.getSingleTransaction);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.updateTransaction
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.deleteTransaction
);

export const TransactionRoutes = router;
