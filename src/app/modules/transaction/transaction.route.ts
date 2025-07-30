import express from "express";
import { transactionController } from "./transaction.controller";

const router = express.Router();

router.post("/", transactionController.createTransaction);
// router.get("/", WalletController.getAllWallet);
// router.get("/:id", WalletController.getSingleWallet);
// router.patch(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   WalletController.updateWallet
// );
// router.delete(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   WalletController.deleteWallet
// );

export const TransactionRoutes = router;
