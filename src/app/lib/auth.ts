import { sendEmailHtml } from './sendEmailHtml';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import nodemailer from "nodemailer";
// import ms, { StringValue } from "ms";
 import { envVars } from "../config/env";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.CUSTOMER,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE,
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            }
        }
    },
        emailVerification:{
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ( { user, token }) => {
            try {
                const varificationUrl = `${envVars.BETTER_AUTH_URL}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: `"Mini-E-Commerce" <${envVars.EMAIL_USER}>`,
                    to: user.email,
                    subject: "Verify Your Email ✔",
                    text: "Hello! Please verify your email address.", // Plain-text version of the message
                    html: sendEmailHtml(varificationUrl)
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.log(error);
            }
        },
    },
    session: {
        expiresIn: 60 * 60 * 60 * 24,
        updateAge: 60 * 60 * 60 * 24,
        cookieCache:{
            enabled: true,
            maxAge: 60 * 60 * 60 * 24,
        }
    },
    socialProviders: {
        google: { 
            prompt: "select_account",
            //accessType: "offline",
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            //redirectURI: `${envVars.BETTER_AUTH_URL}/api/auth/callback/google`,
        }, 
    },
});