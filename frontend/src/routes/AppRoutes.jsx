import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Auth,
  Connections,
  Dashboard,
  Locks,
  Properties,
  ReservationDetail,
  Reservations,
  Rooms,
  Users,
} from "../pages";
import ProtectedRoutes from "./ProtectedRoutes";
import StaffLayout from "../layouts/StaffLayout";
import AdminLayout from "../layouts/AdminLayout";
import NotFound from "../pages/NotFound";
import ConfirmationForm from "../forms/ConfirmationForm";
import CheckIn from "../forms/CheckIn";
import ConfirmationSuccess from "../components/ConfirmationSuccess";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth?mode=login" />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/confirmations/:id" element={<ConfirmationForm />} />
        <Route path='/confirmation-success' element={<ConfirmationSuccess />} />

        <Route path='/check_in' element={<CheckIn />} />

        <Route element={<ProtectedRoutes role="staff" />}>
          <Route element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="locks" element={<Locks />} />
            <Route path="connections" element={<Connections />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="reservations/:id" element={<ReservationDetail />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="locks" element={<Locks />} />
            <Route path="users" element={<Users />} />
            <Route path="connections" element={<Connections />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="reservations/:id" element={<ReservationDetail />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes role="superadmin" />}>
          <Route path="/super-admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="locks" element={<Locks />} />
            <Route path="users" element={<Users />} />
            <Route path="connections" element={<Connections />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="reservations/:id" element={<ReservationDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
