import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProductService } from "./product.service";
import { Request, Response } from "express";
import paginationSortingHelper from "../../../helpers/paginationSortingHelper";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Product created successfully",
        data: result
    });
})

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const { search } = req.query
    const searchString = typeof search === 'string' ? search : undefined
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const result = await ProductService.getAllProducts({search: searchString, page, limit, skip, sortBy, sortOrder});
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Products retrieved successfully",
        data: result
    });
})

const getOneProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const result = await ProductService.getOneProduct(productId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result
    });
})

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const result = await ProductService.updateProduct(productId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Product updated successfully",
        data: result
    });
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    await ProductService.deleteProduct(productId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Product deleted successfully"
    });
})

export const ProductController = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
}