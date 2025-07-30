import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
const router = express.Router();

// router.post("/", WalletController.createWallet);
router.get("/", WalletController.getAllWallet);
router.get("/:id", WalletController.getSingleWallet);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.updateWallet
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.deleteWallet
);

export const WalletRoutes = router;
