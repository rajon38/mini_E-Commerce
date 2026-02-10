import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IProductCreatePayload, IProductUpdatePayload } from "./product.interface"

const createProduct = async (payload: IProductCreatePayload) => {
    const product = await prisma.product.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            imageUrl: payload.imageUrl,
            stock: payload.stock
        }
    });
    return product;
}

const getAllProducts = async ({search, page, limit, skip, sortBy, sortOrder}: 
    {search: string | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {
    const andConditions: Prisma.ProductWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" }},
            ]
        });
    }
    andConditions.push({ isDeleted: false });

    const products = await prisma.product.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.product.count({
        where: {
            AND: andConditions
        }
    });
    return {products,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getOneProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });
    if (!product) {
        throw new Error("Product not found");
    }
    await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            views: {
                increment: 1
            }
        }
    });
    return product;
}

const updateProduct = async (productId: string, payload: IProductUpdatePayload) => {
    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    const updatedProduct = await prisma.product.update({
        where: {
            id: existingProduct.id
        },
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            imageUrl: payload.imageUrl,
            stock: payload.stock,
            updatedAt: new Date()
        }
    });
    return updatedProduct;
}

//soft delete
const deleteProduct = async (productId: string) => {
    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    await prisma.product.update({
        where: {
            id: existingProduct.id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    });
}

export const ProductService = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
}