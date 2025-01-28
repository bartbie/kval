import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";
import { Link } from "react-router";

export const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({
    to,
    children,
}) => (
    <NavigationMenuItem>
        <Link
            to={to}
            className="rounded-lg border border-transparent px-4 py-2 text-base transition-colors focus:outline focus:outline-4 focus:outline-[auto] focus:outline-webkit-focus-ring-color hover:border-[#646cff]"
        >
            {children}
        </Link>
    </NavigationMenuItem>
);

export const BaseHeader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <header className="sticky top-0 w-full shadow-md z-50 flex items-center justify-between p-4">
            Musik Sampsil
            {children && (
                <NavigationMenu>
                    <NavigationMenuList>{children}</NavigationMenuList>
                </NavigationMenu>
            )}
        </header>
    );
};
