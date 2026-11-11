import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URI as string);
const db = client.db("hireloop_");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "seeker", // "seeker" | "recruiter" | "admin"
                input: true, // allow the client to set it on signup
            },
        },
    },
});

/** Quick role helpers for server-side checks. */
export function hasRole(user: { role?: string | null }, ...roles: string[]) {
    return roles.includes(user?.role ?? "seeker");
};
