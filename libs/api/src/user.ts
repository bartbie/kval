import { mkWithId, withIdSchema } from "id";
import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const credentialsSchema = z.object({
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userFLNameSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
});

export const userInfoSchema = userFLNameSchema
    .extend({
        age: z.number().int().min(18),
        bio: z.string().default(""),
        instruments: z.array(z.string()),
        genres: z.array(z.string()),
    })
    .merge(withIdSchema);

export type UserInfo = z.infer<typeof userInfoSchema>;

const userBase = userInfoSchema.merge(credentialsSchema);

export const newUserSchema = userBase.strip();

export const userSchema = mkWithId(newUserSchema);

export const updateUserSchema = userBase.partial().merge(withIdSchema).strip();

export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
