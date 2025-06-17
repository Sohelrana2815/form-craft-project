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
import TempDetailTabs from "../pages/personalPage/myTemplates/templateDetails/TempDetailTabs";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          {/* Manage user route */}
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
          {/* Temp-Detail-tabs  */}
          <Route path="temp-tabs/:templateId" element={<TempDetailTabs />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
