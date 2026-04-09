import axios from "axios";
import useAuthStore from "../store/AuthStore";
import { useEffect, useState } from "react";

const CheckIn = () => {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const urlToken = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await axios.post(
          "http://localhost:5000/reservations/check_in",
          { token: urlToken },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [token, urlToken]);

  if (loading) {
    return <h1>Checking you in...</h1>;
  }

  if (error) {
    return <h1 className="text-red-500">{error}</h1>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{data?.message}</h1>

      <p className="mt-4 text-lg">
        Your Room Access Code:{" "}
        <span className="text-green-500 font-bold">{data?.passcode}</span>
      </p>
      <p>Check your inbox for further information</p>
    </div>
  );
};

export default CheckIn;
