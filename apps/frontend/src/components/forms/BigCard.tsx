import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default ({
    isLoading,
    header,
    children,
}: {
    isLoading: boolean;
    header?: React.ReactNode;
    children?: React.ReactNode;
}) => {
    if (isLoading)
        return (
            <main className="flex justify-center items-center min-h-screen p-4">
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[100px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-[250px]" />
                        <Skeleton className="h-3 w-[200px]" />
                    </div>
                </div>
            </main>
        );

    return (
        <main className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader>{header}</CardHeader>
                <Separator />
                <CardContent className="pt-6">{children}</CardContent>
            </Card>
        </main>
    );
};
