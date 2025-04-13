import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../pages/admin/manage-users/ManageUsers";
import Unauthorized from "../pages/error/Unauthorized";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="manage-users"
            element={
              <PrivateRoute requiredRole="admin">
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
