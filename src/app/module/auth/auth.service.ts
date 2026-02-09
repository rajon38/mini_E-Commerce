import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
//import { prisma } from "../../lib/prisma";

interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
}

interface ILoginPayload {
    email: string;
    password: string;
}

const registerUser = async (payload: IRegisterUserPayload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    })
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register patient");
    }

    try {
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    })
        return {
        ...data,
        accessToken,
        refreshToken
    };
    } catch (error) {
        console.log("Error creating patient record:", error);
        await prisma.user.delete({
            where: {
                id: data.user!.id
            }
        });
        throw error;
    }
}

const login = async (payload: ILoginPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Invalid email or password");
    }
    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "Your account has been deleted. Please contact support.");
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    })
    return {
        accessToken,
        refreshToken,
        ...data
    };
}

export const AuthService = {
    registerUser,
    login
}