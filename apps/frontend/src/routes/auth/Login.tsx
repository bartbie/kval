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
import { Link } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import { useZodForm } from "@/hooks/use-zod-form";
import { loginSchema } from "@libs/api";
import { useLogin } from "@/lib/auth";

export default () => {
    setAuthTitle("Login");

    const login = useLogin();
    const form = useZodForm(loginSchema, {
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: (data) => login.mutate(data),
    });
    const { onSubmit, control } = form;

    return (
        <>
            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
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
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={login.isPending}
                    >
                        Login
                    </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <Link
                    to="/auth/signup"
                    className="text-blue-600 hover:underline"
                >
                    Don't have an account? Sign Up
                </Link>
            </div>
        </>
    );
};
