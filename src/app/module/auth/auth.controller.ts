import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });
})

const login = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.login(payload);
    const { accessToken, refreshToken, token, ...rest } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Login successful",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const freshUser = await AuthService.getProfile(userId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: freshUser
    });

});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;

    const updatedUser = await AuthService.updateProfile(userId as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile updated successfully",
        data: updatedUser
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    await AuthService.deleteUser(userId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User deleted successfully",
        data: null
    });
});

export const AuthController = {
    registerUser,
    login,
    getProfile,
    updateProfile,
    deleteUser
}