import { hash } from "bcryptjs";
import prismaClient from "../../prisma/index";

interface CreateUserProps {
    name: string,
    email: string,
    password: string
}

class CreateUserService {
    async execute({ name, email, password }: CreateUserProps) {

        const findUser = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (findUser?.email) {
            throw new Error("Usuário já existente")
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            }
        })

        return user;
    }
}

export { CreateUserService };