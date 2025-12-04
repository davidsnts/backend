import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { CreateUserSchema } from "./schemas/userSchema";
import { validateSchema } from "./middlewares/validateSchema";

const router = Router();

router.post('/users', validateSchema(CreateUserSchema), new CreateUserController().handle);

export { router };