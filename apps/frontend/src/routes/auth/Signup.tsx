import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { SignUpFormInput, signupSchema } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import * as auth from "../../lib/api/auth";
import { useZodForm } from "@/hooks/use-zod-form";
import { useToast } from "@/hooks/use-toast";

const mutationFn = async (data: SignUpFormInput) => {
    const result = await auth.signup(data);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export default () => {
    setAuthTitle("Create your account");
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useZodForm(signupSchema, {
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const { handleSubmit, control } = form;

    const mutation = useMutation({
        mutationFn,
        onSuccess: (x) => {
            navigate("/me");
        },
        onError: (x) => {
            toast({
                title: "Error!",
                description: x.message,
            });
        },
    });

    const onSubmit: SubmitHandler<SignUpFormInput> = (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex space-x-4">
                        <FormField
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="First Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Last Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={mutation.isPending}
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <Link
                    to="/auth/login"
                    className="text-blue-600 hover:underline"
                >
                    Already have an account? Login
                </Link>
            </div>
        </>
    );
};
