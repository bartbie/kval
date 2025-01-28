import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUser } from "@/hooks/use-user";
import { useZodForm } from "@/hooks/use-zod-form";
import * as API from "@libs/api";
import { useMutation } from "@tanstack/react-query";
import { unpackResult } from "@/lib/utils";
import { update } from "@/lib/api/me";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ListField from "@/components/forms/ListField";
import SimpleField from "@/components/forms/SimpleField";
import BigCard from "@/components/forms/BigCard";
import { CardDescription, CardTitle } from "@/components/ui/card";

export default () => {
    const { user, invalidate, isLoading } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();

    const edit = useMutation({
        mutationFn: async (data: API.UpdateMe) =>
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

    return (
        <BigCard
            isLoading={isLoading}
            header={
                <>
                    <CardTitle className="text-3xl font-bold">
                        Edit Your Profile
                    </CardTitle>
                    <CardDescription></CardDescription>
                </>
            }
        >
            <Form {...form}>
                <form onSubmit={onSubmit} className="">
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
                    <SimpleField
                        name="age"
                        label="Age"
                        placeholder="Your age"
                        type="number"
                        min={18}
                        control={control}
                    />
                    <SimpleField
                        name="bio"
                        label="Bio"
                        placeholder="Your bio"
                        control={control}
                        element={<Textarea />}
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
        </BigCard>
    );
};
