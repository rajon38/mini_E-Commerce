import { prisma } from "../../lib/prisma";
import { IProductCreatePayload } from "./product.interface"

const createProduct = async (payload: IProductCreatePayload) => {
    const { name, description, price, imageUrl, stock } = payload;
    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            imageUrl,
            stock
        }
    });
    return product;
}

export const ProductService = {
    createProduct
}