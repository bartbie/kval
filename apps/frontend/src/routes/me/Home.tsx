import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import * as API from "@libs/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[100px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-[250px]" />
                <Skeleton className="h-3 w-[200px]" />
            </div>
        </div>
    );
}

const Ensemble = ({ ensemble: e }: { ensemble: API.Ensemble }) => (
    <Card key={e._id} className="hover:shadow-lg transition-shadow">
        <Link to={`/ensembles/${e._id}`}>
            <CardHeader>
                <CardTitle className="line-clamp-1">{e.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                    {e.bio}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                {e.genres.map((g) => (
                    <Badge>{g}</Badge>
                ))}
            </CardFooter>
        </Link>
    </Card>
);

const Ensembles = ({ ensembles }: { ensembles: API.Ensemble[] }) => (
    <>
        {ensembles.map((e) => (
            <Ensemble ensemble={e} />
        ))}
    </>
);

const Skeletons = ({ count }: { count: number }) => (
    <>
        {[...Array(count)].map((_) => (
            <SkeletonCard />
        ))}
    </>
);

export default () => {
    const { user, isLoading } = useUser();
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                {isLoading ? <Skeletons count={12} /> : <Ensembles {...user} />}
            </div>
        </main>
    );
};
