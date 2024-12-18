import { Outlet, Route, Routes } from "react-router";
import FrontPage from "./FrontPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthLayout from "./auth/AuthLayout";
import Home from "./me/Home";
import CreateProfile from "./auth/CreateProfile";
import { Toaster } from "@/components/ui/toaster";

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
                <Route path="auth">
                    <Route path="create-profile" element={<CreateProfile />} />
                </Route>
                <Route path="me">
                    <Route index element={<Home />} />
                </Route>
            </Route>
        </Routes>
    );
};
