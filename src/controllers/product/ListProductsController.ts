import { Request, Response } from 'express'
import { ListProductsService } from '../../services/product/ListProductsService';

class ListProductsController {
    async handle(req: Request, res: Response) {
        const { disabled } = req.query;

        // Converte o query param para boolean, padrão é false
        const disabledFilter = disabled === 'true' ? true : false;

        const listProducts = new ListProductsService();

        const products = await listProducts.execute({ disabled: disabledFilter })

        return res.status(200).json(products)
    }
}

export { ListProductsController }

