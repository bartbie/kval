import UnloggedHeader from "@/components/headers/UnloggedHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";

export const AuthLayout = ({
    header = <UnloggedHeader />,
}: {
    header?: React.ReactNode;
}) => {
    const [title, setTitle] = useState("");
    return (
        <>
            {header}
            <main className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Outlet context={{ setTitle }} />
                    </CardContent>
                </Card>
            </main>
        </>
    );
};

export const useAuthTitle = () => {
    const { setTitle } = useOutletContext<{
        setTitle: (title: string) => void;
    }>();
    return setTitle;
};

export const setAuthTitle = (title: string) => {
    const setTitle = useAuthTitle();
    useEffect(() => setTitle(title), [setTitle]);
};

export default AuthLayout;
