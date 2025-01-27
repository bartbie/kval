import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";

const NavItem: React.FC<{ to: string; children: string }> = ({
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

export default () => {
    return (
        <header className="sticky top-0 w-full shadow-md z-50 flex items-center justify-between p-4">
            Musik Sampsil
            <NavigationMenu>
                <NavigationMenuList>
                    <NavItem to="/auth/login">Log in</NavItem>
                    <NavItem to="/auth/signup">Sign up</NavItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
};
