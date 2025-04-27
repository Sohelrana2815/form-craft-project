import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../pages/admin/manage-users/ManageUsers";
import Unauthorized from "../pages/error/Unauthorized";
import PersonalPage from "../pages/personalPage/PersonalPage";
import TemplateDetailPage from "../pages/personalPage/myTemplates/templateDetailPage/TemplateDetailPage";
import CreateTemplate from "../pages/createTemplate/CreateTemplate";
import TemplateForm from "../pages/home/gallery/TemplateForm";

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
          <Route path="templateForm/:id" element={<TemplateForm />} />
          <Route path="personal-page" element={<PersonalPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="templateDetails" element={<TemplateDetailPage />} />
          <Route
            path="create-template"
            element={
              <PrivateRoute>
                <CreateTemplate />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
