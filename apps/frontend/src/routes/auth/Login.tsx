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
import SimpleField from "@/components/forms/SimpleField";

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
                    <SimpleField
                        control={control}
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                    />
                    <SimpleField
                        control={control}
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Password"
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
