import "./App.css";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import DashboardLayouts from "./components/Layouts/DashboardLayouts";
import DashboardHomePage from "./pages/Dashboard/DashboardHomePage";
import MenuPage from "./pages/Dashboard/Menu/MenuPage";
import TransaksiPage from "./pages/Dashboard/Transaksi/TransaksiPage";
import LaporanPage from "./pages/Dashboard/Laporan/LaporanPage";
import ProfileTokoPage from "./pages/Dashboard/ProfileToko/ProfileTokoPage";
import UserAdministratorPage from "./pages/Dashboard/UserAdministrator/UserAdministratorPage";
import AuthLogin from "./pages/Auth/AuthLogin";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryPage from "./pages/Dashboard/Category/CategoryPage";
import MenuAdministrator from "./pages/Dashboard/Menu/MenuAdministrator";

import PrivateRoute from "./config/auth/PrivateRoute";
import AdminRoute from "./config/auth/AdminRoute";
import OrderDetailPage from "./pages/Dashboard/Transaksi/OrderDetailPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<AuthLogin />} />
        <Route path="order/:orderId" element={<OrderDetailPage />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayouts>
              <Outlet />
            </DashboardLayouts>
          }
        >
          <Route element={<PrivateRoute />}>
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<DashboardHomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="transaksi" element={<TransaksiPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="profile-toko" element={<ProfileTokoPage />} />
            <Route path="user-administrator" element={<UserAdministratorPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="menu-admin" element={<MenuAdministrator />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
