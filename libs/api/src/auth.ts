import { credentialsSchema, emailSchema, userFLNameSchema } from "user";
import { z } from "zod";

export const loginSchema = credentialsSchema;

export type LoginInput = z.infer<typeof loginSchema>;

/////////

export const signupSchema = userFLNameSchema.extend({
    email: emailSchema,
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[!@#$%^&*()]/,
            "Password must contain at least one special character",
        ),
});

export type SignUpInput = z.infer<typeof signupSchema>;

export const signupFormSchema = signupSchema
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type SignUpFormInput = z.infer<typeof signupSchema>;
