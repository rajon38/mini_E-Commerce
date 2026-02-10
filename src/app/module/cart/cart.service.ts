//CURD for cart and cart item

import { prisma } from "../../lib/prisma"
import { ICartItemCreatePayload } from "./cart.interface";

const createUpdateCart = async (userId: string, payload: ICartItemCreatePayload) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    const existingCart = await prisma.cart.findFirst({
        where: {
            userId: existingUser.id
        },
        include: {
            cartItems: true
        }
    });
    
    if (!existingCart) {
        const newCart = await prisma.cart.create({
            data: {
                userId: existingUser.id,
                cartItems: {
                    create: {
                        productId: payload.productId,
                        quantity: payload.quantity
                    }
                }
            },
            include: {
                cartItems: true
            }
        });
        return newCart;
    } else {
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: existingCart.id,
                productId: payload.productId
            }
        });
        if (existingCartItem) {
            const updatedCartItem = await prisma.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: payload.quantity
                }
            });
            return updatedCartItem;
        } else {
            const newCartItem = await prisma.cartItem.create({
                data: {
                    cartId: existingCart.id,
                    productId: payload.productId,
                    quantity: payload.quantity
                }
            });
            return newCartItem;
        }
    }
}

const getCartByUserId = async (userId: string) => {
    const existingCart = await prisma.cart.findFirst({
        where: {
            userId: userId
        },
        include: {
            cartItems: true
        }
    });
    return existingCart;
}

const deleteCartItem = async (cartItemId: string) => {
    await prisma.cartItem.delete({
        where: {
            id: cartItemId
        }
    });

    return { message: "Cart item deleted successfully" };
}
export const CartService = {
    createUpdateCart,
    getCartByUserId,
    deleteCartItem
}