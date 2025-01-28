import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { unpackResult } from "@/lib/utils";
import { get } from "@/lib/api/users";
import { Link, useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import BigCard from "@/components/forms/BigCard";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useIdParam } from "@/hooks/use-id-param";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

export default () => {
    const { user, isLoading: isUserLoading } = useUser();
    const { id } = useIdParam();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data, isError, error, isLoading } = useQuery({
        queryFn: async () => unpackResult(await get(id)),
        queryKey: ["ensembles", id],
    });

    if (isUserLoading || isLoading) return <div>Loading...</div>;
    if (isError || data == undefined) {
        toast({
            title: "Error!",
            description: error?.message ?? "Operation Failed",
        });
        navigate("/me");
        return;
    }
    const { bio, firstName, lastName, genres, instruments, ensembles } = data;
    return (
        <BigCard
            isLoading={isLoading}
            header={
                <>
                    <CardTitle className="text-3xl font-bold">
                        {firstName} {lastName}
                    </CardTitle>
                    <CardDescription></CardDescription>
                </>
            }
        >
            <div>
                <h3 className="font-semibold text-lg mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">{bio}</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2">Instruments</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <span className="truncate">
                        {instruments.map((i) => (
                            <Badge variant={"outline"}>{i}</Badge>
                        ))}
                    </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Genres</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <span className="truncate">
                        {genres.map((i) => (
                            <Badge variant={"outline"}>{i}</Badge>
                        ))}
                    </span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2">Ensembles</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {ensembles.map((ensemble) => (
                        <Link to={`/ensembles/${ensemble._id}`}>
                            <div
                                key={ensemble._id}
                                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">
                                            {ensemble.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <Music className="h-3 w-3" />
                                        <span className="truncate">
                                            {ensemble.genres.map((i) => (
                                                <Badge variant={"outline"}>
                                                    {i}
                                                </Badge>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </p>
            </div>
        </BigCard>
    );
};
