import { OrderStatus } from './../../../generated/prisma/client';
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IOrderCreatePayload } from "./order.interface";

const createOrder = async (userId: string,payload: IOrderCreatePayload)=> {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if(!existingUser){
        throw new Error("User not found");
    }
    return prisma.$transaction(async (prisma) => {
        if (!payload.orderItems || payload.orderItems.length === 0) {
            throw new Error("Order must contain at least one item");
        }
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: payload.orderItems.map(item => item.productId)
                },
                isDeleted: false
            }
        });
        if (products.length !== payload.orderItems.length) {
            throw new Error("One or more products not found or insufficient stock");
        }
        const productById = new Map(products.map(p => [p.id, p]));
        for (const item of payload.orderItems) {
            const product = productById.get(item.productId);
            if (!product || product.stock < item.quantity) {
                throw new Error("One or more products not found or insufficient stock");
            }
        }
        const order = await prisma.orders.create({
            data: {
                userId: existingUser.id,
                totalAmount: payload.totalAmount,
                status: payload.status,
                paymentMethod: payload.paymentMethod,
                orderItems: {
                    create: payload.orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });
        await prisma.product.updateMany({
            where: {
                id: {
                    in: payload.orderItems.map(item => item.productId)
                }
            },
            data: {
                stock: {
                    decrement: payload.orderItems.reduce((acc, item) => acc + item.quantity, 0)
                }
            }
        });
        return order;
    });
    
}

const getAllOrders = async ({userId, page, limit, skip, sortBy, sortOrder}: {userId: string, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {
    const andConditions: Prisma.OrdersWhereInput[] = [];
    
    if (typeof userId === "string") {
        andConditions.push({
            userId
        });
    }
    andConditions.push({
        isDeleted: false
    });
    const orders = await prisma.orders.findMany({
        where: {
            AND: andConditions
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc'
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    const totalOrders = await prisma.orders.count({
        where: {
            AND: andConditions
        }
    });
    return {
        orders,
        meta:{
            total: totalOrders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit)
        }
    };
}

const updateOrderById = async (orderId: string,  userId: string, data: Partial<IOrderCreatePayload>) => {
    return prisma.$transaction(async (tx) => {

    const order = await tx.orders.findUnique({
        where: { id: orderId },
            include: {
                orderItems: true,
                user: true,
            },
        });


    if (!order) {
        throw new Error("Order not found");
    }
    const user = await tx.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (order.userId !== userId) {
        throw new Error("Unauthorized to update this order");
    }

    if (order.status !== OrderStatus.PENDING) {
        throw new Error("Only pending orders can be updated");
    }

    //let totalAmount = order.totalAmount;

    if (data.orderItems) {
        if (data.orderItems.length === 0) {
            throw new Error("Order must contain at least one item");
        }

    const products = await tx.product.findMany({
        where: {
            id: { in: data.orderItems.map(i => i.productId) },
        },
    });

    if (products.length !== data.orderItems.length) {
        throw new Error("One or more products not found");
    }

    //totalPrice = 0;


    const newItems = data.orderItems.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    //totalAmount += product.price * item.quantity;


    return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
    };
    });

    await tx.orderItem.deleteMany({
        where: { orderId },
    });


    await tx.orderItem.createMany({
        data: newItems.map(i => ({ ...i, orderId })),
    });
    }


    const updatedOrder = await tx.orders.update({
        where: { id: orderId },
        data: {
            paymentMethod: data.paymentMethod ?? order.paymentMethod,
            totalAmount: data.totalAmount ?? order.totalAmount,
        },
        include: {
            orderItems: {
                include: { product: true },
            },
        },
    });

    return updatedOrder;
    });
};
const orderStatusUpdate = async (orderId: string, status: OrderStatus) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const updatedOrder = await prisma.orders.update({
    where: { id: orderId },
    data: {
      status: {
        set: status,
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedOrder;
};


const deleteOrder = async (orderId: string) => {
    if(!orderId) {
        throw new Error("Order ID is required");
    }

    await prisma.orders.delete({
        where: { id: orderId },
    });

    return { message: "Order deleted successfully"};
}  

export const OrderService = {
    createOrder,
    getAllOrders,
    updateOrderById,
    orderStatusUpdate,
    deleteOrder
}