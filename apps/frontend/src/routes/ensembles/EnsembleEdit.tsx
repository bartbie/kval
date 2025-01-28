import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BadgeIcon, PlusCircle, X } from "lucide-react";
import { useZodForm } from "@/hooks/use-zod-form";
import * as API from "@libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIdParam } from "@/hooks/use-id-param";
import { unpackResult } from "@/lib/utils";
import { edit as update, get } from "@/lib/api/ensembles";
import { Link, useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SimpleField from "@/components/forms/SimpleField";
import { Textarea } from "@/components/ui/textarea";
import ListField from "@/components/forms/ListField";
import { Skeleton } from "@/components/ui/skeleton";
import BigCard from "@/components/forms/BigCard";

export default () => {
    const { id } = useIdParam();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data, isLoading } = useQuery({
        queryFn: async () => unpackResult(await get(id)),
        queryKey: ["ensembles", id],
    });

    const edit = useMutation({
        mutationFn: async (data: API.UpdateEnsemble) =>
            unpackResult(await update(id, data)),
        onSuccess: async ({ _id }) => {
            await queryClient.invalidateQueries({
                queryKey: ["ensembles", _id],
            });
            await navigate(`/ensembles/${_id}`);
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });

    const form = useZodForm(API.updateEnsembleSchema, {
        defaultValues: {
            name: data?.name,
            bio: data?.bio,
            genres: data?.genres,
        },
        onSubmit: (data) => edit.mutate(data),
    });
    const { onSubmit } = form;

    return (
        <BigCard
            isLoading={isLoading}
            header={
                <>
                    <CardTitle className="text-3xl font-bold">
                        Edit Ensemble
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
                            <Link to={`/ensembles/${id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit">Edit Ensemble</Button>
                    </div>
                </form>
            </Form>
        </BigCard>
    );
};
