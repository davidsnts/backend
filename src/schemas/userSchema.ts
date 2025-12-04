import { z } from "zod";

export const CreateUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
        email: z.string().email({ message: "Email inválido" }),
        password: z.string({ message: "Senha é obrigatória" }).min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    }),
});

