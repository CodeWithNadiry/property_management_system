import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Input from "../components/Input";
import Button from "../components/Button";
import usePropertyStore from "../store/PropertyStore";
import { createRoom, updateRoom } from "../api/rooms.service";

const RoomForm = ({ data }) => {
  const { role, user } = useAuthStore();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const { activeProperty } = usePropertyStore();
  const isEdit = !!data;
  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [unitGroupId, setUnitGroupId] = useState("");
  const [error, setError] = useState(null);

  // Prefill form if editing
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoomNumber(data.room_number ?? "");
      setFloor(data.floor ?? "");
      setUnitGroupId(data.unit_group_id ?? "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!roomNumber.trim()) {
      setError("Room number is required");
      return;
    }

    try {
      const payload = {
        room_number: roomNumber,
        floor: floor ? Number(floor) : null,
        unit_group_id: unitGroupId ? Number(unitGroupId) : null, // add this
      };

      if (isEdit) {
        await updateRoom(data.id, payload, propertyId);
      } else {
        await createRoom(payload, propertyId);
      }

      queryClient.invalidateQueries(["rooms"]);
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Error saving room");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Room" : "Add Room"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Input
        label="Room Number"
        type="text"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
        placeholder="Enter room number"
        required
      />

      <Input
        label="Unit Group ID"
        type="number"
        value={unitGroupId}
        onChange={(e) => setUnitGroupId(e.target.value)}
        placeholder="Enter unit group ID"
      />
      <Input
        label="Floor (optional)"
        type="number"
        value={floor}
        onChange={(e) => setFloor(e.target.value)}
        placeholder="Enter floor"
      />

      <div className="flex gap-4 mt-5">
        <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
        <Button type="button" variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;
