import { Result } from "@libs/shared";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type UnpackOverload = {
    <T, E>(result: Result<T, E>): T extends void ? null : T;
    <T extends void, E>(result: Result<T, E>): null;
};

export type Unpacked<R extends Result<any, any>> =
    R extends Result<infer T, any> ? (T extends void ? null : T) : never;

export const unpackResult: UnpackOverload = <T, E>(result: Result<T, E>) => {
    const res = result as { success: boolean; error?: E; data?: T };
    if (!res.success) {
        throw new Error(JSON.stringify(res?.error ?? "Failed operation"));
    }
    return res?.data ?? null;
};
