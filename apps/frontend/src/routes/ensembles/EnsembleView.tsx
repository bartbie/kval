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
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Edit, Music, Users2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default () => {
    const { user } = useUser();
    const { id } = useIdParam();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data, isError, error, isLoading } = useQuery({
        queryFn: async () => unpackResult(await api.get(id)),
        queryKey: ["ensembles", id],
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
                                </span>
                            </div>
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={owner._id !== user._id}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {owner._id !== user._id
                                    ? "Only owners can edit their ensembles."
                                    : "As an owner you can edit this ensemble."}
                            </TooltipContent>
                        </Tooltip>
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
                    {/* <div className="flex items-center text-sm text-muted-foreground">
                        <time>Created January 2024</time>
                    </div> */}
                </CardContent>
            </Card>
        </main>
        // <main className="flex justify-center items-center min-h-screen">
        //     <Card className="max-w-xl">
        //         <CardHeader>
        //             <div className="flex items-center justify-between">
        //                 <CardTitle className="text-center text-2xl">
        //                     {name}
        //                 </CardTitle>
        //                 <div className="flex items-center space-x-2 cursor-pointer"></div>
        //             </div>
        //             <CardDescription className="text-base mt-4">
        //                 <span className="text-sm text-muted-foreground">
        //                     created by {owner.firstName} {owner.lastName}
        //                 </span>
        //             </CardDescription>
        //         </CardHeader>
        //         <CardContent>{bio}</CardContent>
        //     </Card>
        // </main>
    );
};
