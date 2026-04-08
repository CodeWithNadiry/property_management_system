import { useEffect, useState } from "react";
import { HiLogout, HiMenu, HiOutlineLockClosed } from "react-icons/hi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import usePropertyStore from "../store/PropertyStore";
import Button from "../components/Button";
import axios from "axios";

const fetchProperties = async (token) => {
  const response = await axios.get("http://localhost:5000/properties", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.properties;
};

const BaseLayout = ({ links }) => {
  const navigate = useNavigate();
  const { user, role, token, logout } = useAuthStore();
  const { activeProperty, setActiveProperty, clearProperty } =
    usePropertyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    clearProperty();
    navigate("/auth?mode=login");
  }

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(token),
    enabled: !!token,
  });

  // Set initial property based on role
  useEffect(() => {
    if (!properties.length) return;

    if (role === "staff" || role === "admin") {
      const assignedProperty = properties.find(
        (p) => p.id === user?.property_id,
      );
      if (assignedProperty) {
        setActiveProperty(assignedProperty);
      }
      return;
    }

    // Superadmin: default to first property if none selected
    if (!activeProperty) {
      setActiveProperty(properties[0]);
    }
  }, [activeProperty, properties, role, setActiveProperty, user?.property_id]);

  function handleChangeProperty(e) {
    const property = properties.find((p) => p.id === Number(e.target.value));
    setActiveProperty(property);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-(--dark-blue) text-white flex flex-col transform transition-transform duration-300 md:translate-x-0 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/20">
          <HiOutlineLockClosed size={32} />
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold">Room & Lock</h2>
            <p className="text-sm">Management</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 p-4 text-sm">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-white text-(--dark-blue) font-semibold shadow"
                      : "hover:bg-white/10"
                  }`
                }
              >
                {Icon && (
                  <Icon
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                )}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm px-6 py-[21.2px] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-(--dark-blue) cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <HiMenu size={26} />
            </button>

            {/* Property selector: only for superadmin */}
            {role === "superadmin" ? (
              <>
                {isLoading ? (
                  <span>Loading properties...</span>
                ) : isError ? (
                  <span>Error loading properties</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium hidden md:inline">
                      Select Property:
                    </span>
                    <select
                      value={activeProperty?.id || ""}
                      onChange={handleChangeProperty}
                      className="px-2 py-2 border rounded-lg bg-white shadow-sm text-sm"
                    >
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              // Admin / Staff: show only property name
              <p className="text-lg font-semibold md:text-2xl">
                🏢 {activeProperty?.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg font-medium capitalize">{user?.name}</span>
            <Button variant="danger" onClick={handleLogout}>
              <span className="flex items-center gap-2">
                <HiLogout size={28} />
                <span className="hidden md:inline">Logout</span>
              </span>
            </Button>
          </div>
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
