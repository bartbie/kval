import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIdParam } from "@/hooks/use-id-param";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import * as api from "@/lib/api/ensembles";
import { unpackResult } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, DoorOpen, Edit, Music, Plus, Users2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import * as API from "@libs/api";

const handleClick = (fn: () => void) => (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    fn();
};

export default () => {
    const { user } = useUser();
    const { id } = useIdParam();
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isError, error, isLoading } = useQuery({
        queryFn: async () => unpackResult(await api.get(id)),
        queryKey: ["ensembles", id],
    });

    const invalidate = async (id: string) => {
        await queryClient.invalidateQueries({
            queryKey: ["ensembles", id],
        });
    };

    const join = useMutation({
        mutationFn: async () => unpackResult(await api.join(id)),
        onSuccess: async ({ _id, name }) => {
            await invalidate(_id);
            toast({
                title: "Success!",
                description: `You joined ${name}`,
            });
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });

    const leave = useMutation({
        mutationFn: async () => unpackResult(await api.leave(id)),
        onSuccess: async ({ _id, name }) => {
            await invalidate(_id);
            toast({
                title: "Success!",
                description: `You left ${name}`,
            });
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError || data == undefined) {
        toast({
            title: "Error!",
            description: error?.message ?? "Operation Failed",
        });
        navigate("/me");
        return;
    }

    const { name, createdBy, bio, genres, members } = data;
    const owner = members.filter((m) => m._id === createdBy)[0];
    const isOwner = owner._id === user._id;
    const isMember = members.some((m) => m._id === user._id);

    const EditButton = ({ disabled }: { disabled?: boolean }) => (
        <Button variant="outline" size="sm" disabled={disabled ?? false}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
        </Button>
    );

    const JoinButton = () => (
        <Button variant="outline" size="sm" onClick={handleClick(join.mutate)}>
            <Plus className="h-4 w-4 mr-2" />
            Join
        </Button>
    );

    const LeaveButton = () => (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleClick(leave.mutate)}
        >
            <DoorOpen className="h-4 w-4 mr-2" />
            Leave
        </Button>
    );

    return (
        <main className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold">
                                {name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Users2 className="h-4 w-4" />
                                <span>
                                    Created by {owner.firstName}{" "}
                                    {owner.lastName}
                                    {isOwner && " (You)"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Tooltip>
                                <TooltipTrigger>
                                    {isMember ? (
                                        isOwner ? (
                                            <Link to={"edit"}>
                                                <EditButton />
                                            </Link>
                                        ) : (
                                            <LeaveButton />
                                        )
                                    ) : (
                                        <JoinButton />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isMember
                                        ? isOwner
                                            ? "As an owner you can edit this ensemble."
                                            : "As a member you can leave this ensemble."
                                        : "As an non-member you can join this ensemble."}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {genres.map((g) => (
                            <Badge>{g}</Badge>
                        ))}
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">About</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {bio}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Members</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {members.map((member) => (
                                <Link to={`/users/${member._id}`}>
                                    <div
                                        key={member._id}
                                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">
                                                    {member.firstName}{" "}
                                                    {member.lastName}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Music className="h-3 w-3" />
                                                <span className="truncate">
                                                    {member.instruments.map(
                                                        (i) => (
                                                            <Badge
                                                                variant={
                                                                    "outline"
                                                                }
                                                            >
                                                                {i}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};
