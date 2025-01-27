import HomeHeader from "@/components/headers/HomeHeader";
import { Outlet } from "react-router";

export const MeLayout = ({
    header = <HomeHeader />,
}: {
    header?: React.ReactNode;
}) => {
    return (
        <>
            {header}
            <Outlet />
        </>
    );
};

export default MeLayout;
