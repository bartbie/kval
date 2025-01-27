import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import { Form } from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import { signupFormSchema } from "@libs/api";
import { useSignup } from "@/lib/auth";
import SimpleField from "@/components/forms/SimpleField";

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
                        <SimpleField
                            name="firstName"
                            label="First Name"
                            placeholder="Your first name"
                            type="text"
                            control={control}
                        />
                        <SimpleField
                            name="lastName"
                            label="Last Name"
                            placeholder="Your last name"
                            type="text"
                            control={control}
                        />
                    </div>
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
                    <SimpleField
                        control={control}
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm Password"
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
