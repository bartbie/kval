import { Navigate, Outlet, Route, Routes } from "react-router";
import FrontPage from "./FrontPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthLayout from "./auth/AuthLayout";
import Home from "./me/Home";
import CreateProfile from "./me/EditProfile";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/auth";
import { BaseHeader } from "@/components/headers/BaseHeader";
import MeLayout from "./me/MeLayout";
import Logout from "./auth/Logout";
import EnsembleView from "./ensembles/EnsembleView";
import { TooltipProvider } from "@/components/ui/tooltip";
import EnsembleEdit from "./ensembles/EnsembleEdit";
import EnsembleAdd from "./ensembles/EnsembleAdd";
import UserView from "./users/UserView";

const RootLayout = () => (
    <>
        <TooltipProvider>
            <Outlet />
            <Toaster />
        </TooltipProvider>
    </>
);

export default () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<FrontPage />} />
                <Route path="auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route
                    path="auth"
                    element={
                        <ProtectedRoute>
                            <AuthLayout header={<BaseHeader />} />
                        </ProtectedRoute>
                    }
                >
                    <Route path="logout" element={<Logout />} />
                </Route>
                <Route
                    path="ensembles"
                    element={
                        <ProtectedRoute>
                            <MeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path=":id" element={<EnsembleView />} />
                    <Route path=":id/edit" element={<EnsembleEdit />} />
                    <Route path="create" element={<EnsembleAdd />} />
                </Route>
                <Route
                    path="users"
                    element={
                        <ProtectedRoute>
                            <MeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path=":id" element={<UserView />} />
                </Route>
                <Route
                    path="me"
                    element={
                        <ProtectedRoute>
                            <MeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="profile" element={<CreateProfile />} />
                </Route>
            </Route>
        </Routes>
    );
};
