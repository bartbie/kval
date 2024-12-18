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
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import { LoginFormInput, loginFormSchema } from "../../lib/api/auth";

export default () => {
  setAuthTitle("Login");

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });
  const { handleSubmit, control } = form;

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    // TODO
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>

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
    </>
  );
};
