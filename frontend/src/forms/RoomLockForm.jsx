import { useState, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Input from "../components/Input";
import Button from "../components/Button";

const RoomLockForm = ({ data }) => {
  const { token } = useAuthStore();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const isEdit = !!data;

  const [userInputs, setUserInputs] = useState({
    roomId: "",
    lockId: "",
    propertyId: "", // added property_id
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserInputs({
        roomId: data.room_id ?? "",
        lockId: data.lock_id ?? "",
        propertyId: data.property_id ?? "", // load property_id
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userInputs.roomId || !userInputs.lockId || !userInputs.propertyId) {
      setError("Room, Lock, and Property are required.");
      return;
    }

    try {
      const payload = {
        room_id: Number(userInputs.roomId),
        lock_id: Number(userInputs.lockId),
        property_id: Number(userInputs.propertyId),
      };

      await axios.post(
        "http://localhost:5000/room-lock/assign",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      queryClient.invalidateQueries(["roomLocks"]);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Error assigning lock");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Room Lock" : "Assign Lock to Room"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Input
        label="Room ID"
        type="number"
        name="roomId"
        value={userInputs.roomId}
        onChange={handleChange}
        placeholder="Enter room ID"
        required
      />

      <Input
        label="Lock ID"
        type="number"
        name="lockId"
        value={userInputs.lockId}
        onChange={handleChange}
        placeholder="Enter lock ID"
        required
      />

      <Input
        label="Property ID"
        type="number"
        name="propertyId"
        value={userInputs.propertyId}
        onChange={handleChange}
        placeholder="Enter property ID"
        required
      />

      <div className="flex gap-4 mt-5">
        <Button type="submit">{isEdit ? "Update" : "Assign"}</Button>
        <Button type="button" variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RoomLockForm;