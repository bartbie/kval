import { Navigate, Outlet, Route, Routes } from "react-router";
import FrontPage from "./FrontPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthLayout from "./auth/AuthLayout";
import Home from "./me/Home";
import CreateProfile from "./auth/CreateProfile";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/auth";
import { BaseHeader } from "@/components/headers/BaseHeader";

const RootLayout = () => (
    <>
        <Outlet />
        <Toaster />
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
                    <Route path="create-profile" element={<CreateProfile />} />
                </Route>
                <Route path="me" element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                </Route>
            </Route>
        </Routes>
    );
};
