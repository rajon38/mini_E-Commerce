// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";

// src/app/routes/index.ts
import { Router as Router5 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/auth/auth.service.ts
import status2 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var OrderStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/lib/sendEmailHtml.ts
var sendEmailHtml = (verificationUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:30px; text-align:center; background:#0d6efd; border-radius:8px 8px 0 0;">
              <h1 style="color:#ffffff; margin:0;">Mini E-Commerce</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#333;">Verify your email address</h2>

              <p style="color:#555; font-size:16px; line-height:1.6;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button (email-safe) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                      style="
                        background:#0d6efd;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 28px;
                        border-radius:6px;
                        font-size:16px;
                        display:inline-block;
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#555; font-size:14px;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; color:#0d6efd; font-size:14px;">
                ${verificationUrl}
              </p>

              <p style="color:#999; font-size:14px; margin-top:30px;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; background:#f4f6f8; border-radius:0 0 8px 8px;">
              <p style="margin:0; color:#999; font-size:12px;">
                \xA9 2025 Mini E-Commerce. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String     @id\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(CUSTOMER)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  orders             Orders[]\n  cart               Cart[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  cartItems CartItem[]\n\n  @@index([userId], name: "idx_cart_userId")\n  @@map("cart")\n}\n\nmodel CartItem {\n  id        String   @id @default(uuid())\n  cartId    String\n  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity  Int      @default(0)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([cartId], name: "idx_cartitem_cartId")\n  @@index([productId], name: "idx_cartitem_productId")\n  @@map("cart_items")\n}\n\nenum Role {\n  ADMIN\n  CUSTOMER\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum OrderStatus {\n  PENDING\n  ACCEPTED\n  PREPARING\n  ON_THE_WAY\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n}\n\nmodel Orders {\n  id            String        @id @default(uuid())\n  userId        String\n  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  totalAmount   Float         @default(0)\n  status        OrderStatus   @default(PENDING)\n  paymentMethod PaymentMethod @default(COD)\n  isDeleted     Boolean       @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  orderItems    OrderItem[]\n\n  @@index([userId], name: "idx_orders_userId")\n  @@index([status], name: "idx_orders_status")\n  @@index([isDeleted], name: "idx_orders_isDeleted")\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id        String   @id @default(uuid())\n  orderId   String\n  order     Orders   @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity  Int      @default(1)\n  price     Float    @default(0)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([orderId], name: "idx_orderitem_orderId")\n  @@index([productId], name: "idx_orderitem_productId")\n  @@map("order_items")\n}\n\nmodel Product {\n  id          String      @id @default(uuid())\n  name        String\n  description String?\n  price       Float       @default(0)\n  imageUrl    String?\n  stock       Int         @default(0)\n  views       Int         @default(0)\n  isDeleted   Boolean     @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n  orderItems  OrderItem[]\n  cartItems   CartItem[]\n\n  @@index([name], name: "idx_product_name")\n  @@index([stock], name: "idx_product_stock")\n  @@index([isDeleted], name: "idx_product_isDeleted")\n  @@map("products")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":"cart"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"views","kind":"scalar","type":"Int"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"}],"dbName":"products"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_USER",
    "EMAIL_PASS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "APP_URL"
  ];
  requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    PORT: process.env.PORT || "8000",
    NODE_ENV: process.env.NODE_ENV || "production",
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APP_URL: process.env.APP_URL
  };
};
var envVars = loadEnvVariables();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CUSTOMER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const varificationUrl = `${envVars.BETTER_AUTH_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Mini-E-Commerce" <${envVars.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify Your Email \u2714",
          text: "Hello! Please verify your email address.",
          // Plain-text version of the message
          html: sendEmailHtml(varificationUrl)
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      //accessType: "offline",
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET
      //redirectURI: `${envVars.BETTER_AUTH_URL}/api/auth/callback/google`,
    }
  }
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const data = jwt.verify(token, secret);
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtil = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  const maxAge = 60 * 60 * 60 * 24;
  CookieUtil.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge
  });
};
var setRefreshTokenCookie = (res, token) => {
  const maxAge = 60 * 60 * 60 * 24;
  CookieUtil.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  const maxAge = 60 * 60 * 60 * 24;
  CookieUtil.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Failed to register patient");
  }
  try {
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.log("Error creating patient record:", error);
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    });
    throw error;
  }
};
var login = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Invalid email or password");
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status2.FORBIDDEN, "Your account has been blocked. Please contact support.");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "Your account has been deleted. Please contact support.");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    accessToken,
    refreshToken,
    ...data
  };
};
var getProfile = async (userId) => {
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
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  return user;
};
var updateProfile = async (userId, payload) => {
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
};
var deleteUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  await prisma.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date(),
      status: UserStatus.DELETED
    }
  });
  return {
    message: "User deleted successfully"
  };
};
var AuthService = {
  registerUser,
  login,
  getProfile,
  updateProfile,
  deleteUser
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/module/auth/auth.controller.ts
import status3 from "http-status";
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var login2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.login(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
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
var getProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const freshUser = await AuthService.getProfile(userId);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: freshUser
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const payload = req.body;
  const updatedUser = await AuthService.updateProfile(userId, payload);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  await AuthService.deleteUser(userId);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User deleted successfully",
    data: null
  });
});
var AuthController = {
  registerUser: registerUser2,
  login: login2,
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  deleteUser: deleteUser2
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...allowedRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtil.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: No session token provided");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = sessionExists.expiresAt;
        const createdAt = sessionExists.createdAt;
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const remainingTime = expiresAt.getTime() - now.getTime();
        const percentRemaining = remainingTime / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", remainingTime.toString());
          console.log("Session is nearing expiration. Consider refreshing the session.");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: User is blocked or deleted");
        }
        if (user.isDeleted) {
          throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: User is deleted");
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          throw new AppError_default(status4.FORBIDDEN, "Forbidden: User does not have the required role");
        }
      }
      const accessToken2 = CookieUtil.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: No access token provided");
      }
    }
    const accessToken = CookieUtil.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: No access token provided");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized: Invalid access token");
    }
    req.user = {
      userId: verifiedToken.data.userId,
      email: verifiedToken.data.email,
      name: verifiedToken.data.name,
      role: verifiedToken.data.role,
      emailVerified: verifiedToken.data.emailVerified
      // add other fields if needed
    };
    if (allowedRoles.length > 0 && !allowedRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status4.FORBIDDEN, "Forbidden: User does not have the required role");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.get("/profile", checkAuth(Role.CUSTOMER, Role.ADMIN), AuthController.getProfile);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.login);
router.patch("/profile", checkAuth(Role.CUSTOMER, Role.ADMIN), AuthController.updateProfile);
router.delete("/:id", checkAuth(Role.ADMIN), AuthController.deleteUser);
var AuthRoute = router;

// src/app/module/product/product.route.ts
import { Router as Router2 } from "express";

// src/app/module/product/product.controller.ts
import status5 from "http-status";

// src/app/module/product/product.service.ts
var createProduct = async (payload) => {
  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      stock: payload.stock
    }
  });
  return product;
};
var getAllProducts = async ({ search, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  andConditions.push({ isDeleted: false });
  const products = await prisma.product.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.product.count({
    where: {
      AND: andConditions
    }
  });
  return {
    products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getOneProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });
  if (!product) {
    throw new Error("Product not found");
  }
  await prisma.product.update({
    where: {
      id: productId
    },
    data: {
      views: {
        increment: 1
      }
    }
  });
  return product;
};
var updateProduct = async (productId, payload) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });
  if (!existingProduct) {
    throw new Error("Product not found");
  }
  const updatedProduct = await prisma.product.update({
    where: {
      id: existingProduct.id
    },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      stock: payload.stock,
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedProduct;
};
var deleteProduct = async (productId) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });
  if (!existingProduct) {
    throw new Error("Product not found");
  }
  await prisma.product.update({
    where: {
      id: existingProduct.id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var ProductService = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct
};

// src/app/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/app/module/product/product.controller.ts
var createProduct2 = catchAsync(async (req, res) => {
  const result = await ProductService.createProduct(req.body);
  sendResponse(res, {
    httpStatusCode: status5.CREATED,
    success: true,
    message: "Product created successfully",
    data: result
  });
});
var getAllProducts2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const searchString = typeof search === "string" ? search : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
  const result = await ProductService.getAllProducts({ search: searchString, page, limit, skip, sortBy, sortOrder });
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result
  });
});
var getOneProduct2 = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const result = await ProductService.getOneProduct(productId);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result
  });
});
var updateProduct2 = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const result = await ProductService.updateProduct(productId, req.body);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Product updated successfully",
    data: result
  });
});
var deleteProduct2 = catchAsync(async (req, res) => {
  const productId = req.params.id;
  await ProductService.deleteProduct(productId);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Product deleted successfully"
  });
});
var ProductController = {
  createProduct: createProduct2,
  getAllProducts: getAllProducts2,
  getOneProduct: getOneProduct2,
  updateProduct: updateProduct2,
  deleteProduct: deleteProduct2
};

// src/app/module/product/product.route.ts
var router2 = Router2();
router2.get("/", ProductController.getAllProducts);
router2.get("/:id", ProductController.getOneProduct);
router2.post("/", checkAuth(Role.ADMIN), ProductController.createProduct);
router2.patch("/:id", checkAuth(Role.ADMIN), ProductController.updateProduct);
router2.delete("/:id", checkAuth(Role.ADMIN), ProductController.deleteProduct);
var ProductRoute = router2;

// src/app/module/cart/cart.route.ts
import { Router as Router3 } from "express";

// src/app/module/cart/cart.service.ts
var createUpdateCart = async (userId, payload) => {
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
};
var getCartByUserId = async (userId) => {
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId
    },
    include: {
      cartItems: true
    }
  });
  return existingCart;
};
var deleteCartItem = async (cartItemId) => {
  await prisma.cartItem.delete({
    where: {
      id: cartItemId
    }
  });
  return { message: "Cart item deleted successfully" };
};
var CartService = {
  createUpdateCart,
  getCartByUserId,
  deleteCartItem
};

// src/app/module/cart/cart.controller.ts
import status6 from "http-status";
var createUpdateCart2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const payload = req.body;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const result = await CartService.createUpdateCart(userId, payload);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Cart updated successfully",
    data: result
  });
});
var getCart = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const result = await CartService.getCartByUserId(userId);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Cart retrieved successfully",
    data: result
  });
});
var deleteCartItem2 = catchAsync(async (req, res) => {
  const cartItemId = req.params.id;
  const result = await CartService.deleteCartItem(cartItemId);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Cart item deleted successfully",
    data: result
  });
});
var CartController = {
  createUpdateCart: createUpdateCart2,
  getCart,
  deleteCartItem: deleteCartItem2
};

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/app/module/cart/cart.route.ts
var router3 = Router3();
router3.post("/", checkAuth(Role.CUSTOMER), CartController.createUpdateCart);
router3.get("/", checkAuth(Role.CUSTOMER), CartController.getCart);
router3.delete("/item/:id", checkAuth(Role.CUSTOMER), CartController.deleteCartItem);
var CartRoute = router3;

// src/app/module/order/order.route.ts
import { Router as Router4 } from "express";

// src/app/module/order/order.service.ts
var createOrder = async (userId, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser) {
    throw new Error("User not found");
  }
  return prisma.$transaction(async (prisma2) => {
    if (!payload.orderItems || payload.orderItems.length === 0) {
      throw new Error("Order must contain at least one item");
    }
    const products = await prisma2.product.findMany({
      where: {
        id: {
          in: payload.orderItems.map((item) => item.productId)
        },
        isDeleted: false
      }
    });
    if (products.length !== payload.orderItems.length) {
      throw new Error("One or more products not found or insufficient stock");
    }
    const productById = new Map(products.map((p) => [p.id, p]));
    for (const item of payload.orderItems) {
      const product = productById.get(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error("One or more products not found or insufficient stock");
      }
    }
    const order = await prisma2.orders.create({
      data: {
        userId: existingUser.id,
        totalAmount: payload.totalAmount,
        status: payload.status,
        paymentMethod: payload.paymentMethod,
        orderItems: {
          create: payload.orderItems.map((item) => ({
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
    await prisma2.product.updateMany({
      where: {
        id: {
          in: payload.orderItems.map((item) => item.productId)
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
};
var getAllOrders = async ({ userId, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
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
      [sortBy || "createdAt"]: sortOrder || "desc"
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
    meta: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit)
    }
  };
};
var updateOrderById = async (orderId, userId, data) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.orders.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: true
      }
    });
    if (!order) {
      throw new Error("Order not found");
    }
    const user = await tx.user.findUnique({
      where: { id: userId }
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
    if (data.orderItems) {
      if (data.orderItems.length === 0) {
        throw new Error("Order must contain at least one item");
      }
      const products = await tx.product.findMany({
        where: {
          id: { in: data.orderItems.map((i) => i.productId) }
        }
      });
      if (products.length !== data.orderItems.length) {
        throw new Error("One or more products not found");
      }
      const newItems = data.orderItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        };
      });
      await tx.orderItem.deleteMany({
        where: { orderId }
      });
      await tx.orderItem.createMany({
        data: newItems.map((i) => ({ ...i, orderId }))
      });
    }
    const updatedOrder = await tx.orders.update({
      where: { id: orderId },
      data: {
        paymentMethod: data.paymentMethod ?? order.paymentMethod,
        totalAmount: data.totalAmount ?? order.totalAmount
      },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });
    return updatedOrder;
  });
};
var orderStatusUpdate = async (orderId, status11) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  const updatedOrder = await prisma.orders.update({
    where: { id: orderId },
    data: {
      status: {
        set: status11
      }
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
  return updatedOrder;
};
var deleteOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  await prisma.orders.delete({
    where: { id: orderId }
  });
  return { message: "Order deleted successfully" };
};
var OrderService = {
  createOrder,
  getAllOrders,
  updateOrderById,
  orderStatusUpdate,
  deleteOrder
};

// src/app/module/order/order.controller.ts
import status7 from "http-status";
var createOrder2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const payload = req.body;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const result = await OrderService.createOrder(userId, payload);
  sendResponse(res, {
    httpStatusCode: status7.CREATED,
    success: true,
    message: "Order created successfully",
    data: result
  });
});
var getAllOrders2 = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
  const result = await OrderService.getAllOrders({ userId, page, limit, skip, sortBy, sortOrder });
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result
  });
});
var updateOrderById2 = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user?.userId;
  const payload = req.body;
  const result = await OrderService.updateOrderById(orderId, userId, payload);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Order updated successfully",
    data: result
  });
});
var orderStatusUpdate2 = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const data = req.body;
  const result = await OrderService.orderStatusUpdate(orderId, data.status);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Order status updated successfully",
    data: result
  });
});
var deleteOrder2 = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await OrderService.deleteOrder(orderId);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Order deleted successfully",
    data: result
  });
});
var OrderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  updateOrderById: updateOrderById2,
  orderStatusUpdate: orderStatusUpdate2,
  deleteOrder: deleteOrder2
};

// src/app/module/order/order.route.ts
var router4 = Router4();
router4.get("/", checkAuth(Role.CUSTOMER, Role.ADMIN), OrderController.getAllOrders);
router4.post("/", checkAuth(Role.CUSTOMER), OrderController.createOrder);
router4.put("/:id", checkAuth(Role.CUSTOMER), OrderController.updateOrderById);
router4.patch("/status/:id", checkAuth(Role.ADMIN), OrderController.orderStatusUpdate);
router4.delete("/:id", checkAuth(Role.ADMIN), OrderController.deleteOrder);
var OrderRoute = router4;

// src/app/routes/index.ts
var router5 = Router5();
router5.use("/auth", AuthRoute);
router5.use("/products", ProductRoute);
router5.use("/carts", CartRoute);
router5.use("/orders", OrderRoute);
var IndexRoute = router5;

// src/app/middleware/globalErrorHandler.ts
import status9 from "http-status";
import z from "zod";

// src/app/errorHelpers/handleZodError.ts
import status8 from "http-status";
var handleZodError = (err) => {
  const statusCode = status8.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("=>"),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from globalErrorHandler:", err);
  }
  let errorSources = [];
  let statusCode = status9.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status9.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : void 0,
    error: envVars.NODE_ENV === "development" ? err : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status10 from "http-status";
var notFound = (req, res) => {
  res.status(status10.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app.ts
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoute);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/server.ts
var bootstrap = () => {
  try {
    app_default.listen(envVars.PORT || 8e3, () => {
      console.log(`Server is running on port ${envVars.PORT || 8e3}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};
bootstrap();
