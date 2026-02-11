
import { OrderStatus, PaymentMethod } from "../../../generated/prisma/enums";

export interface IOrderCreatePayload {
    userId: string;
    totalAmount: number;
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    orderItems: IOrderItemCreatePayload[];
}

export interface IOrderItemCreatePayload {
    productId: string;
    quantity: number;
    price: number;
}