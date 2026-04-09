import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthStore from "../store/AuthStore";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Input from "../components/Input";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationCity,
  MdPublic,
  MdGroup,
} from "react-icons/md";
import { confirmationSchema } from "../schemas/confirmation.schema";

async function fetchConfirmationData(id, token) {
  const res = await axios.get(
    `http://localhost:5000/reservations/${id}/confirm_form`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
}

const ConfirmationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();

  const [userInputs, setUserInputs] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    guestNumber: "",
  });

  const [error, setError] = useState(null);

  const { data: reservationData, isLoading } = useQuery({
    queryKey: ["confirmationData", id],
    queryFn: () => fetchConfirmationData(id, token),
    enabled: !!token && !!id,
  });

  useEffect(() => {
    if (!reservationData) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserInputs((prev) => ({
      ...prev,
      name: reservationData.name || "",
      email: reservationData.email || "",
      phone: reservationData.phone || "",
    }));
  }, [reservationData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, email, phone, city, country, guestNumber } = userInputs;

    const result = confirmationSchema.safeParse(userInputs);

    if (!result.success) {
      return setError(result.error.issues.map((err) => err.message));
    }

    try {
      const payload = {
        name,
        email,
        phone,
        city,
        country,
        number_of_guests: guestNumber,
      };

      await axios.post(
        `http://localhost:5000/reservations/${id}/confirm`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/confirmation-success");
    } catch (error) {
      setError(error.response?.data?.message || error.message);

      // error.response.data.message is your backend custom message
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Reservation Confirmation
        </h2>

        {error && (
          <div className="text-red-500 text-center">
            {Array.isArray(error) ? (
              error.map((err, i) => <p key={i}>{err}</p>)
            ) : (
              <p>{error}</p>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={userInputs.name}
            onChange={handleChange}
            placeholder="Enter your name"
            icon={MdPerson}
          />

          <Input
            label="Email"
            name="email"
            value={userInputs.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={MdEmail}
          />

          <Input
            label="Phone"
            name="phone"
            value={userInputs.phone}
            onChange={handleChange}
            placeholder="Enter your phone"
            icon={MdPhone}
          />

          <Input
            label="City"
            name="city"
            value={userInputs.city}
            onChange={handleChange}
            placeholder="Enter your city"
            icon={MdLocationCity}
          />

          <Input
            label="Country"
            name="country"
            value={userInputs.country}
            onChange={handleChange}
            placeholder="Enter your country"
            icon={MdPublic}
          />

          <Input
            label="Number of Guests"
            name="guestNumber"
            type="number"
            value={userInputs.guestNumber}
            onChange={handleChange}
            placeholder="Enter number of guests"
            icon={MdGroup}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationForm;

// error.message is the default error text created by:
// JavaScript OR
// Axios
