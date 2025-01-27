import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import { signupFormSchema } from "@libs/api";
import { useSignup } from "@/lib/auth";

export default () => {
    setAuthTitle("Create your account");

    const signup = useSignup();
    const form = useZodForm(signupFormSchema, {
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: (data) => signup.mutate(data),
    });
    const { onSubmit, control } = form;

    return (
        <>
            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
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
                        disabled={signup.isPending}
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
