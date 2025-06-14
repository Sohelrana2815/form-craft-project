import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../pages/admin/manage-users/ManageUsers";
import AdminRoute from "./AdminRoute";
import UserProfile from "../pages/profile/UserProfile";
import CreateTemplateWithQuestions from "../components/questions/CreateTemplateWithQuestions";
import PersonalPage from "../pages/personalPage/PersonalPage";

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
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
          <Route
            path="create-template"
            element={
              <PrivateRoute>
                <CreateTemplateWithQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="user-profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="personal-page" element={<PersonalPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
