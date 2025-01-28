import { DoorOpen, Plus } from "lucide-react";
import { BaseHeader, NavItem } from "./BaseHeader";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default () => {
    return (
        <BaseHeader>
            <NavItem to="/ensembles/create">Create New Ensemble</NavItem>
            <NavItem to="/ensembles">Search Ensembles</NavItem>
            <NavItem to="/me">My Ensembles</NavItem>
            <NavItem to="/me/profile">My Profile</NavItem>
            <NavItem to="/auth/logout">Log out</NavItem>
        </BaseHeader>
    );
};
