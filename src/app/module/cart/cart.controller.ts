import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { CartService } from "./cart.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createUpdateCart = catchAsync(async (req:Request, res: Response) =>  {
    const userId = req.user?.userId;
    const payload = req.body;
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const result = await CartService.createUpdateCart(userId, payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Cart updated successfully",
        data: result
    });
})

const getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const result = await CartService.getCartByUserId(userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Cart retrieved successfully",
        data: result
    });
})

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
    const cartItemId = req.params.id as string;
    const result = await CartService.deleteCartItem(cartItemId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Cart item deleted successfully",
        data: result
    });
})

export const CartController = {
    createUpdateCart,
    getCart,
    deleteCartItem
};