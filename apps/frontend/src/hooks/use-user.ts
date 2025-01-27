import { useAuth } from "@/lib/auth";
import { AuthContextValue } from "../lib/auth";
export { USE_USER_QUERY_KEY } from "../lib/auth";

type UseUser = Omit<AuthContextValue, "user" | "trespass"> & {
    user: Exclude<AuthContextValue["user"], null>;
};

export const useUser = (): UseUser => {
    const res = useAuth();
    if (res.user == null) {
        if (res.trespass) return { ...res, user: {} as any };
        throw new Error("useUser must be used within a protected route");
    }
    return res as UseUser;
};
