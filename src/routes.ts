import { Router, Request, Response } from "express";

const router = Router();

router.post('/users', (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = { id: 1, name, email, password };
    console.log(user); 
    res.status(201).json({ message: "Funcionando" });
});

export { router };