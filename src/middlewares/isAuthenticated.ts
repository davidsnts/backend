import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    const authtoken = req.headers.authorization

    if (!authtoken)
        return res.status(401).json({
            error: "Token não fornecido"
        })

    const [, token] = authtoken.split(" ")

    try {
        const { sub } = verify(token!, process.env.JWT_SECRET as string) as Payload

        req.user_id = sub;

        return next();
    } catch (error) {
        return res.status(401).json({
            error: "Token inválido"
        })
    }  

}
