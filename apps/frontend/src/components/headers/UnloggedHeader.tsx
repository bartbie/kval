import { BaseHeader, NavItem } from "./BaseHeader";

export default () => {
    return (
        <BaseHeader>
            <NavItem to="/auth/login">Log in</NavItem>
            <NavItem to="/auth/signup">Sign up</NavItem>
        </BaseHeader>
    );
};
