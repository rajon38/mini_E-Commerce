import { Role } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        const seedAdminData = {
            email: "admin@gmail.com",
            name: "Admin",
            role: Role.ADMIN,
            password: "admin123"

        }
        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: seedAdminData.email }
        });
        if (existingAdmin) {
            throw new Error("Admin user already exists");
        }

        // Create admin user
        const signUpAdmin = await auth.api.signUpEmail({
            body: seedAdminData
        });

        if (!signUpAdmin.user) {
            throw new Error("Failed to create admin user");
        }
        if (signUpAdmin.user) {
            await prisma.user.update({
                where: { email: seedAdminData.email },
                data: { emailVerified: true }
            });
        }
    } catch (error) {
        console.log(error);
    }
}
seedAdmin();