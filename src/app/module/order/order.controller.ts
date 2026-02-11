import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrderService } from "./order.service";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const result = await OrderService.createOrder(userId, payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Order created successfully",
        data: result
    });
})

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.query as { userId: string };
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const result = await OrderService.getAllOrders({ userId, page, limit, skip, sortBy, sortOrder });
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result
    });
})

const updateOrderById = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await OrderService.updateOrderById(orderId, userId as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Order updated successfully",
        data: result
    });
})

const orderStatusUpdate = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const data = req.body
    const result = await OrderService.orderStatusUpdate(orderId, data.status);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Order status updated successfully",
        data: result
    });
})

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const result = await OrderService.deleteOrder(orderId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Order deleted successfully",
        data: result
    });
})

export const OrderController = {
    createOrder,
    getAllOrders,
    updateOrderById,
    orderStatusUpdate,
    deleteOrder
};