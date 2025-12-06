import prismaClient from "../../prisma/index";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";
import { log } from "node:console";
import { resolve } from "node:path";
import { rejects } from "node:assert";
import { date } from "zod";
import { UploadStream } from "cloudinary";

interface CreateProductServiceProps {
    name: string;
    price: string;
    description: string;
    category_id: string;
    image_buffer: Buffer;
    imageName: string;
}

class CreateProductService {
    async execute({
        name,
        price,
        description,
        category_id,
        image_buffer,
        imageName
    }: CreateProductServiceProps) {

        const categoryExists = await prismaClient.category.findFirst({
            where: {
                id: category_id
            }
        })

        if (!categoryExists) {
            throw new Error("Categoria não encontrada")
        }

        let bannerUrl = "";

        try {
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "products",
                    resource_type: "image",
                    public_id: `${Date.now()}-${imageName.split(".")[0]}`
                }, (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })

                const bufferStream = Readable.from(image_buffer);
                bufferStream.pipe(uploadStream)
            })

            bannerUrl = result.secure_url;

        } catch (error) {
            console.log(error);

            throw new Error("Erro ao fazer upload da iamgem")
        }


        const product = await prismaClient.product.create({
            data: {
                name: name,
                price: parseInt(price),
                description: description,
                banner: bannerUrl,
                category_id: category_id,
                image: bannerUrl
            },
            select:{
                id: true,
                name: true,
                price: true,
                description: true,
                category_id: true,
                banner: true,
                createdAt: true
            }
        })
        return product
    }
}

export { CreateProductService }