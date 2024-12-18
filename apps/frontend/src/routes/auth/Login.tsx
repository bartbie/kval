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
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { setAuthTitle } from "./AuthLayout";
import { LoginFormInput, loginFormSchema } from "../../lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import * as auth from "../../lib/api/auth";
import { useZodForm } from "@/hooks/use-zod-form";
import { useToast } from "@/hooks/use-toast";

const mutationFn = async (data: LoginFormInput) => {
  const result = await auth.login(data);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export default () => {
  setAuthTitle("Login");

  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useZodForm(loginFormSchema, {
    defaultValues: {
      email: "",
      password: "",
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

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    mutation.mutate(data);
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
      <div className="text-center mt-4">
        <Link to="/auth/signup" className="text-blue-600 hover:underline">
          Don't have an account? Sign Up
        </Link>
      </div>
    </>
  );
};
