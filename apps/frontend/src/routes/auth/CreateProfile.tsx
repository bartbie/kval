import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useZodForm } from "@/hooks/use-zod-form";
import * as API from "@libs/api";
import { useMutation } from "@tanstack/react-query";
import { unpackResult } from "@/lib/utils";
import { update } from "@/lib/api/me";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import ListField from "@/components/ListField";

export default () => {
    const { user, invalidate } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();

    const edit = useMutation({
        mutationFn: async (data: API.UpdateEnsemble) =>
            unpackResult(await update(data)),
        onSuccess: async (_) => {
            await invalidate();
            await navigate("/me");
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });

    const form = useZodForm(API.updateMeSchema, {
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            bio: user.bio,
            instruments: user.instruments,
            genres: user.genres,
        },

        onSubmit: (data) => edit.mutate(data),
    });
    const { onSubmit, control } = form;

    const Field = (
        args: Exclude<React.ComponentProps<"input">, "name"> & {
            label: string;
            name: typeof form extends UseFormReturn<infer T> ? keyof T : never;
        },
    ) => {
        const { name, label, placeholder, type, ...rest } = args;
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input
                                type={type}
                                placeholder={placeholder}
                                {...field}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={onSubmit} className="">
                    <Field
                        name="firstName"
                        label="First Name"
                        placeholder="Your first name"
                        type="text"
                    />
                    <Field
                        name="lastName"
                        label="Last Name"
                        placeholder="Your last name"
                        type="text"
                    />
                    <Field
                        name="age"
                        label="Age"
                        placeholder="Your age"
                        type="number"
                        min={18}
                    />
                    <FormField
                        control={control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Your bio"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ListField
                        name="genres"
                        label="genres"
                        placeholder="Add genre..."
                        control={control}
                    />
                    <ListField
                        name="instruments"
                        label="instruments"
                        placeholder="Add instrument..."
                        control={control}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={edit.isPending}
                    >
                        Save Profile
                    </Button>
                </form>
            </Form>
        </>
    );
};
