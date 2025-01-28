import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import * as API from "@libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIdParam } from "@/hooks/use-id-param";
import { unpackResult } from "@/lib/utils";
import { edit as update, get, create } from "@/lib/api/ensembles";
import { Link, useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import SimpleField from "@/components/forms/SimpleField";
import { Textarea } from "@/components/ui/textarea";
import ListField from "@/components/forms/ListField";
import { Skeleton } from "@/components/ui/skeleton";
import BigCard from "@/components/forms/BigCard";
import { useUser } from "@/hooks/use-user";

export default () => {
    const user = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    const insert = useMutation({
        mutationFn: async (data: API.NewEnsemble) =>
            unpackResult(await create(data)),
        onSuccess: async ({ _id }) => {
            await queryClient.invalidateQueries({
                queryKey: ["ensembles", _id],
            });
            await user.invalidate();
            await navigate(`/ensembles/${_id}`);
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });

    const form = useZodForm(API.newEnsembleSchema, {
        defaultValues: {
            name: "",
            bio: "",
            genres: [],
        },
        onSubmit: (data) => insert.mutate(data),
    });
    const { onSubmit } = form;

    return (
        <BigCard
            isLoading={false}
            header={
                <>
                    <CardTitle className="text-3xl font-bold">
                        Add Ensemble
                    </CardTitle>
                    <CardDescription></CardDescription>
                </>
            }
        >
            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-6">
                    <SimpleField
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder="Ensemble name"
                    />

                    <SimpleField
                        control={form.control}
                        name="bio"
                        label="About"
                        element={
                            <Textarea
                                placeholder="Tell us about your ensemble..."
                                className="min-h-[120px]"
                            />
                        }
                    />
                    <ListField
                        name="genres"
                        placeholder="new genre"
                        control={form.control}
                        label={
                            <h3 className="font-semibold text-lg">Genres</h3>
                        }
                    />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline">
                            <Link to={`/me`}>Cancel</Link>
                        </Button>
                        <Button type="submit">Add Ensemble</Button>
                    </div>
                </form>
            </Form>
        </BigCard>
    );
};
