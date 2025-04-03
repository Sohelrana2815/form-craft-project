import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/home";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route index element={<Home />} />
      </Routes>
    </>
  );
};

export default MainRoutes;
