import * as api from "@/lib/api/me";
import { unpackResult } from "@/lib/utils";
import { LoginInput, MeWithEnsembles, SignUpFormInput } from "@libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext } from "react";
import { Navigate, Outlet, Route, useNavigate } from "react-router";
import * as auth from "./api/auth";
import { useToast } from "@/hooks/use-toast";

const TOKEN_KEY = "auth_token";

const getToken = (): string | null => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? token : null;
};

const setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};

export const USE_USER_QUERY_KEY = "user";

const useUserInternal = () => {
    return useQuery({
        queryKey: [USE_USER_QUERY_KEY],
        queryFn: async () => unpackResult(await api.get()),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export type AuthContextValue = {
    user: MeWithEnsembles | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isError: boolean;
    error: Error | null;
    logout: () => void;
    trespass: boolean | undefined; // debug purpose
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

    const logout = useCallback(() => {
        clearToken();
        queryClient.clear();
        navigate("/");
    }, [queryClient, navigate]);

    if (getToken() == null) {
        queryClient.clear();
        return (
            <AuthContext.Provider
                value={{
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    isError: false,
                    logout,
                    trespass,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }
    const { data: user, isLoading, error, isError } = useUserInternal();

    if (isError) {
        clearToken();
    }

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isAuthenticated: !!user,
                isLoading,
                error,
                isError,
                logout,
                trespass,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
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
    const { user, isLoading, isError, trespass } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!trespass && (isError || !user)) {
        return <Navigate to={redirectPath} replace />;
    }

    // if (requiredRoles && !requiredRoles.some(role => user.roles?.includes(role))) {
    //   return <Navigate to="/unauthorized" replace />;
    // }

    return children ? children : <Outlet />;
};

export const useLogin = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const mutationFn = async (data: LoginInput) =>
        unpackResult(await auth.login(data));

    return useMutation({
        mutationFn,
        onSuccess: (x) => {
            setToken(x.token);
            navigate("/me");
        },
        onError: (x) => {
            toast({
                title: "Error!",
                description: x.message,
            });
        },
    });
};

export const useSignup = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const mutationFn = async (data: SignUpFormInput) =>
        unpackResult(await auth.signup(data));

    return useMutation({
        mutationFn,
        onSuccess: (x) => {
            setToken(x.token);
            navigate("/auth/create-profile");
        },
        onError: (x) => {
            toast({
                title: "Error!",
                description: x.message,
            });
        },
    });
};
