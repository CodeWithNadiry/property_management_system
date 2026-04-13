import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import useAuthStore from "../store/AuthStore";
import { useActionState } from "react";

async function loginAction(prevState, formData, login, navigate) {
  const data = Object.fromEntries(formData);
  const { email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await axios.post(
      "https://property-management-system-ht59.vercel.app/auth/login",
      {
        email,
        password,
      },
    );

    login({
      token: res.data.token,
      user: res.data.user,
    });

    const role = res.data.user.role;

    if (role === "superadmin") {
      navigate("/super-admin/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

    return { error: null };
  } catch (err) {
    return {
      error: err.response?.data?.message || "Login failed",
    };
  }
}

const Auth = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [formState, formAction] = useActionState(
    (prev, formData) => loginAction(prev, formData, login, navigate),
    { error: null },
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-(--dark-blue) to-(--light-blue)">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <HiOutlineLockClosed
            size={36}
            className="mx-auto text-(--dark-blue)"
          />
          <h2 className="text-lg font-semibold mt-2">Login</h2>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email"
            icon={HiOutlineMail}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            icon={HiOutlineLockClosed}
          />

          {formState?.error && (
            <p className="text-red-500 text-sm text-center">
              {formState.error}
            </p>
          )}

          <Button full>Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
