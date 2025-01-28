import * as api from "@/lib/api/me";
import { unpackResult } from "@/lib/utils";
import { LoginInput, MeWithEnsembles, SignUpFormInput } from "@libs/api";
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { createContext, useCallback, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import * as auth from "./api/auth";
import { useToast } from "@/hooks/use-toast";
import { clearToken, getToken, setToken } from "./_token";

export const USE_USER_QUERY_KEY = "user";

export type AuthContextValue = {
    user: MeWithEnsembles | null;
    isLoading: boolean;
    isPending: boolean;
    isAuthenticated: boolean;
    isError: boolean;
    error: Error | null;
    logout: () => void;
    trespass: boolean | undefined; // debug purpose
    invalidate: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = (x: {
    trespass?: boolean;
    children: React.ReactNode;
}) => {
    const { children } = x;
    const trespass = x?.trespass;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: user,
        isLoading,
        error,
        isError,
        isPending,
    } = useQuery({
        queryKey: [USE_USER_QUERY_KEY],
        queryFn: async () => {
            const res = await api.get();
            console.debug("queryFN", res);
            return unpackResult(res);
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    const logout = useCallback(() => {
        clearToken();
        queryClient.clear();
        navigate("/");
    }, [queryClient, navigate]);

    const invalidate = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: [USE_USER_QUERY_KEY],
        });
    }, [queryClient]);

    const token = getToken();
    const contextValue = {
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: isLoading && !!token,
        isPending: isPending && !!token,
        error: token ? error : null,
        isError: isError && !!token,
        trespass,
        logout,
        invalidate,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    console.log("Auth context:", context);
    console.log("Token:", getToken());
    return context;
};

interface ProtectedRouteProps {
    redirectPath?: string;
    children?: React.ReactNode;
    // requiredRoles?: string[];
}

export const ProtectedRoute = ({
    redirectPath = "/",
    children,
    // requiredRoles,
}: ProtectedRouteProps) => {
    const data = useAuth();
    console.debug("PR:", data);
    const { user, isLoading, isError, isPending, trespass } = data;

    if (isPending || isLoading) {
        return <div>Loading...</div>;
    }
    if (trespass) return children ? children : <Outlet />;

    if (isError || !user) {
        return <Navigate to={redirectPath} replace />;
    }

    // if (requiredRoles && !requiredRoles.some(role => user.roles?.includes(role))) {
    //   return <Navigate to="/unauthorized" replace />;
    // }

    return children ? children : <Outlet />;
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: LoginInput) =>
            unpackResult(await auth.login(data)),
        onSuccess: async (data) => {
            setToken(data.token);
            await queryClient.invalidateQueries({
                queryKey: [USE_USER_QUERY_KEY],
            });
            await navigate("/me");
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });
};
export const useSignup = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: SignUpFormInput) =>
            unpackResult(await auth.signup(data)),
        onSuccess: async (data) => {
            setToken(data.token);
            await queryClient.invalidateQueries({
                queryKey: [USE_USER_QUERY_KEY],
            });
            await navigate("/me/profile");
        },
        onError: (e) => {
            toast({
                title: "Error!",
                description: e.message ?? "Operation Failed",
            });
        },
    });
};
