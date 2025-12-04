import prismaClient from "../../prisma/index";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";


interface AuthUserServerProps {
    email: string,
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthUserServerProps) {

        const findUser = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!findUser) {
            return { error: "Usuário ou senha incorretas" }
        }

        const senhaValida = await bcrypt.compare(password, findUser?.password);

        if (!senhaValida) {
            return { error: "Usuário ou senha incorretas" }
        }

        const token = sign(
            {
                name: findUser.name,
                email: findUser.email,
            },
            process.env.JWT_SECRET as string,
            {
                subject: findUser.id,
                expiresIn: "30d",
            }
        );
        return {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
            token: token,
        };
    }
}

export { AuthUserService }