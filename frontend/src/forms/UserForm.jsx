import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import { useActionState } from "react";

import Input from "../components/Input";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import Button from "../components/Button";
import usePropertyStore from "../store/PropertyStore";

async function userAction(
  prevState,
  formData,
  isEdit,
  token,
  userId,
  closeModal,
  propertyId
) {
  const data = Object.fromEntries(formData);

  const { name, email, password, role, is_active } = data;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  if (!isEdit && !password) {
    return { error: "Password is required" };
  }

  try {
    let payload = {
      name,
      email,
      role,
      is_active: is_active === "on",
    };

    if (password) {
      payload.password = password;
    }

    if (isEdit) {
      await axios.patch(`http://localhost:5000/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {property_id: propertyId}
      });
    } else {
      await axios.post("http://localhost:5000/users", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {property_id: propertyId}
      });
    }

    closeModal();
    window.location.reload();

    return { error: null };
  } catch (err) {
    return {
      error: err.response?.data?.message || "Something went wrong",
    };
  }
}

const UserForm = ({ data }) => {
  const { token, role, user } = useAuthStore();
  const { activeProperty } = usePropertyStore();
  const { closeModal } = useModalStore();
  const propertyId = role === 'superadmin' ? activeProperty?.id : user?.property_id;

  const isEdit = !!data;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: data.name || "",
        email: data.email || "",
        password: "",
        role: data.role || "staff",
        is_active: data.is_active ?? true,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [formState, formAction] = useActionState(
    (prev, formData) =>
      userAction(prev, formData, isEdit, token, data?.id, closeModal, propertyId),
    { error: null },
  );

  return (
    <form action={formAction} className="space-y-5">
      <h2 className="text-xl font-semibold text-center">
        {isEdit ? "Edit User" : "Add User"}
      </h2>

      {formState?.error && (
        <p className="text-red-500 text-sm text-center">{formState.error}</p>
      )}

      <div className="space-y-3">
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          icon={HiOutlineUser}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          icon={HiOutlineMail}
        />

        {!isEdit && (
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            icon={HiOutlineLockClosed}
          />
        )}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>


        <div className="flex items-center justify-between">
          <span>Active User</span>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-5">
        <Button type="submit">{isEdit ? "Update" : "Create"}</Button>

        <Button type="button" variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
