import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BadgeIcon, Delete, PlusCircle, X } from "lucide-react";
import { useZodForm } from "@/hooks/use-zod-form";
import * as API from "@libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIdParam } from "@/hooks/use-id-param";
import { unpackResult } from "@/lib/utils";
import { edit as update, get, disband } from "@/lib/api/ensembles";
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
import { useUser } from "@/hooks/use-user";

const handleClick = (fn: () => void) => (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    fn();
};
export default () => {
    const { invalidate } = useUser();
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

    const del = useMutation({
        mutationFn: async () => unpackResult(await disband(id)),
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "You disbanded your ensemble",
            });
            await queryClient.removeQueries({ queryKey: ["ensembles", id] });
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

    const form = useZodForm(API.updateEnsembleSchema, {
        defaultValues: {
            name: data?.name,
            bio: data?.bio,
            genres: data?.genres,
        },
        onSubmit: (data) => edit.mutate(data),
    });
    const { onSubmit } = form;

    const DelButton = () => (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleClick(del.mutate)}
        >
            <Delete className="h-4 w-4 mr-2" />
            Disband
        </Button>
    );

    return (
        <BigCard
            isLoading={isLoading}
            header={
                <>
                    <CardTitle className="text-3xl font-bold">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            Edit Ensemble
                            <DelButton />
                        </div>
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
