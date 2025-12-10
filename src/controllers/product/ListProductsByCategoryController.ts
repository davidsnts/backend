import { Request, Response } from 'express'
import { ListProductsByCategoryService } from '../../services/product/ListProductsByCategoryService';

class ListProductsByCategoryController {
    async handle(req: Request, res: Response) {
        try {
            const { category_id } = req.query;

            const listProductsByCategory = new ListProductsByCategoryService();

            const products = await listProductsByCategory.execute({ 
                category_id: category_id as string 
            });

            return res.status(200).json(products);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

export { ListProductsByCategoryController }

