import { Route, Routes } from "react-router";
import FrontPage from "./FrontPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthLayout from "./auth/AuthLayout";
import { useState } from "react";

export default () => {
  const [] = useState();
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};
