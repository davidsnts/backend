import prismaClient from "../../prisma/index";

interface DeleteProductServiceProps {
    product_id: string;
}

class DeleteProductService {
    async execute({ product_id }: DeleteProductServiceProps) {
        try {

            const product = await prismaClient.product.findFirst({
                where: {
                    id: product_id
                }
            })
            
            if (!product)
            {                
                return { message: "Produto não encontrado" }
            }

            await prismaClient.product.update({
                where: {
                    id: product_id
                },
                data: {
                    disabled: true
                }
            })

            return { message: "Produto deletado/arquivado com sucesso" }
        } catch (error) {
            console.log(error)
            throw new Error("Falha ao deletar o produto")
        }
    }
}

export { DeleteProductService }