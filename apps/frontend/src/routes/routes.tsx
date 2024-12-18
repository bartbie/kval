import { Route, Routes } from "react-router";
import FrontPage from "./FrontPage";

export default () => (
  <Routes>
    <Route path="/" element={<FrontPage />} />
  </Routes>
);
