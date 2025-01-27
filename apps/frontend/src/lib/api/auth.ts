import { LoginInput, SignUpFormInput } from "@libs/api";
import { Result } from "@libs/shared";
import { api } from "./_client";

export const loginError = {
    NoSuchUser: "No such user exists!",
    WrongPassword: "Wrong password!",
} as const;

export type LoginError = (typeof loginError)[keyof typeof loginError];

export const signup = async (
    data: SignUpFormInput,
): Promise<Result<{ token: string }, string>> => {
    return await api.post("/auth/signup", data);
};

export const login = async (
    data: LoginInput,
): Promise<Result<{ token: string }, string>> => {
    return await api.post("/auth/login", data);
};
