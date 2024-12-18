import { Route, Routes } from "react-router";
import FrontPage from "./FrontPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

export default () => (
  <Routes>
    <Route path="/" element={<FrontPage />} />
    <Route path="auth">
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Route>
  </Routes>
);
