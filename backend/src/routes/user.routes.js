import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserRole
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createUserValidation,
    updateUserValidation,
    updateUserRoleValidation
} from "../validation/user.validation.js";

const userRouter = Router();

userRouter.get(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    getUsers
);

userRouter.post(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    createUserValidation,
    validate,
    createUser
);

userRouter.get(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    getUserById
);

userRouter.put(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    updateUserValidation,
    validate,
    updateUser
);

userRouter.patch(
    "/:id/role",
    authenticateUser,
    authorizeRoles("admin"),
    updateUserRoleValidation,
    validate,
    updateUserRole
);

export default userRouter;
