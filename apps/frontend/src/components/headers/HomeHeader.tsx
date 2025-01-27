import { BaseHeader, NavItem } from "./BaseHeader";

export default () => {
    return (
        <BaseHeader>
            <NavItem to="/ensembles">Log out</NavItem>
            <NavItem to="/me">Profile</NavItem>
            <NavItem to="/auth/logout">Log out</NavItem>
        </BaseHeader>
    );
};
