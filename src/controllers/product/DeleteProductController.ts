import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
    async handle(req: Request, res: Response) {
        const { product_id } = req.query;
        const deleteProduct = new DeleteProductService();

        const product = await deleteProduct.execute({ product_id: product_id as string })
        res.status(200).json(product)
    }
}

export { DeleteProductController }