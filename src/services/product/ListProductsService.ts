import prismaClient from "../../prisma/index";

interface ListProductsServiceProps {
    disabled: boolean;
}

class ListProductsService {
    async execute({ disabled }: ListProductsServiceProps) {
        try {
            const products = await prismaClient.product.findMany({
                where: {
                    disabled: disabled
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    image: true,
                    banner: true,
                    disabled: true,
                    category_id: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            
            return products;
        } catch (error) {
            throw new Error("Falha ao listar produtos")
        }
    }
}

export { ListProductsService }

