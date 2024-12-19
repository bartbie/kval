import { z } from "zod";
import { mock } from "./mock";

export const loginFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

export const signupSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[!@#$%^&*()]/,
                "Password must contain at least one special character",
            ),
        confirmPassword: z.string(),
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type SignUpFormInput = z.infer<typeof signupSchema>;

export const loginError = {
    NoSuchUser: "No such user exists!",
    WrongPassword: "Wrong password!",
} as const;

export type LoginError = (typeof loginError)[keyof typeof loginError];

export const signup = async (
    data: Omit<SignUpFormInput, "confirmPassword">,
): Promise<
    | {
          success: true;
          data: Omit<SignUpFormInput, "confirmPassword">;
      }
    | {
          success: false;
          error: string;
      }
> => {
    if (data.email === "test@test.com") {
        return { success: false, error: "Email is taken!" } as const;
    }
    return { success: true, data } as const;
};

export const login = async (
    data: LoginFormInput,
): Promise<
    | {
          success: true;
          data: typeof userMock;
      }
    | {
          success: false;
          error: LoginError;
      }
> => {
    if (userMock == null)
        return {
            success: false,
            error: loginError.NoSuchUser,
        } as const;
    if (userMock.email !== data.email)
        return {
            success: false,
            error: loginError.NoSuchUser,
        } as const;
    if (userMock.password !== data.password)
        return {
            success: false,
            error: loginError.WrongPassword,
        } as const;
    return {
        success: true,
        data: userMock,
    } as const;
};
