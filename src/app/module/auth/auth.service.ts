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
interface IUpdateUserPayload {
    name?: string;
    password?: string;
    image?: string;
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

const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return user;
}

const updateProfile = async (userId: string, payload: IUpdateUserPayload) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return updatedUser;
}

//soft delete
const deleteUser = async (userId: string) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!existingUser) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    await prisma.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            status: UserStatus.DELETED
        }
    });

    return {
        message: "User deleted successfully"
    };
}


export const AuthService = {
    registerUser,
    login,
    getProfile,
    updateProfile,
    deleteUser
}