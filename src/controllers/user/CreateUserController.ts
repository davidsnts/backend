import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";
import prismaClient from "../../prisma/index";

class CreateUserController {
    async handle(req: Request, res: Response) {

        const createUserService = new CreateUserService();

        const { name, email, password } = req.body;

        const user = await createUserService.execute({
            name: name,
            email: email,
            password: password
        });

        res.json({ message: user })
    }
}

export { CreateUserController };