import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT),
  UserControllers.getAllUsers
);
router.get(
  "/all-agents",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllAgents
);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);

router.get(
  "/user/me",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe
);

router.patch(
  "/action/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.actionUser
);
router.patch(
  "/agents/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.agentApproved
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.deleteUser
);

export const UserRoutes = router;
