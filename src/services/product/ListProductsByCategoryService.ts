import prismaClient from "../../prisma/index";

interface ListProductsByCategoryServiceProps {
    category_id: string;
}

class ListProductsByCategoryService {
    async execute({ category_id }: ListProductsByCategoryServiceProps) {
        try {
            // Verifica se a categoria existe
            const category = await prismaClient.category.findUnique({
                where: {
                    id: category_id
                }
            });

            if (!category) {
                throw new Error("Categoria não encontrada");
            }

            // Busca todos os produtos da categoria
            const products = await prismaClient.product.findMany({
                where: {
                    category_id: category_id
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
            });

            return products;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Falha ao listar produtos da categoria");
        }
    }
}

export { ListProductsByCategoryService }

