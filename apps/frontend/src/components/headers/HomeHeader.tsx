import { BaseHeader, NavItem } from "./BaseHeader";

export default () => {
    return (
        <BaseHeader>
            <NavItem to="/ensembles">Search Ensembles</NavItem>
            <NavItem to="/me">Profile</NavItem>
            <NavItem to="/auth/logout">Log out</NavItem>
        </BaseHeader>
    );
};
