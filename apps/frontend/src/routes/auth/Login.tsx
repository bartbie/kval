import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInput = z.infer<typeof loginFormSchema>;

export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    // TODO
    console.log(data);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Root-level error (e.g., authentication failure) */}
            {errors.root && (
              <p className="text-red-500 text-sm text-center">
                {errors.root.message}
              </p>
            )}

            {/* Login Button */}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Navigation to Signup */}
          <div className="text-center mt-4">
            <Link to="/auth/signup" className="text-blue-600 hover:underline">
              Don't have an account? Sign Up
            </Link>
          </div>

          {/* Forgot Password Link */}
          {/* <div className="text-center mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </main>
  );
};
