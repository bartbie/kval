import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
    FieldValues,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type UseFormOpts<T extends FieldValues> = Exclude<
    Parameters<typeof useForm<T>>[0],
    undefined
>;
type Opts<T extends FieldValues> = RequireKeys<
    Omit<UseFormOpts<T>, "resolver">,
    "defaultValues"
> & {
    onSubmit?: SubmitHandler<T>;
};

export const useZodForm = <
    T extends z.Schema<any, any>,
    O extends Opts<z.infer<T>>,
>(
    schema: T,
    opts: O,
): UseFormReturn<z.infer<T>> & {
    onSubmit: O extends { onSubmit: SubmitHandler<any> }
        ? (e: React.BaseSyntheticEvent) => Promise<void>
        : undefined;
} => {
    const onSubmit = opts.onSubmit;
    if (onSubmit != undefined) {
        delete opts.onSubmit;
    }
    const res = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        ...opts,
    });
    return {
        ...res,
        onSubmit: onSubmit && (res.handleSubmit(onSubmit) as any),
    };
};
