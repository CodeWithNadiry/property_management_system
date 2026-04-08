/* eslint-disable react-hooks/set-state-in-effect */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Button from "../components/Button";
import {
  createConnection,
  editConnection,
  getUnAssignedLocks,
  getUnAssignedRooms,
} from "../api/connection.service";

async function fetchUnAssignedLocks(propertyId) {
  return await getUnAssignedLocks(propertyId);
}

async function fetchUnAssignedRooms(propertyId) {
  return await getUnAssignedRooms(propertyId);
}
const RoomLockForm = ({ data }) => {
  const isEdit = !!data;
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { activeProperty } = usePropertyStore();
  const { role, user } = useAuthStore();
  const [selectedLockId, setSelectedLockId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [error, setError] = useState(null);
  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  const { data: unAssignedLocks } = useQuery({
    queryKey: ["unAssignedLocks", propertyId],
    queryFn: () => fetchUnAssignedLocks(propertyId),
    enabled: !!propertyId,
  });

  const { data: unAssignedRooms } = useQuery({
    queryKey: ["unAssignedRooms", propertyId],
    queryFn: () => fetchUnAssignedRooms(propertyId),
    enabled: !!propertyId,
  });
  useEffect(() => {
    if (data) {
      setSelectedLockId(data.lock_id ?? "");
      setSelectedRoomId(data.room_id ?? "");
    }
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedLockId || !selectedRoomId) {
      setError("Lock id and Room id is required.");
    }

    try {
      const payload = {
        lock_id: Number(selectedLockId),
        room_id: Number(selectedRoomId),
      };

      if (isEdit) {
        await editConnection(data.id, payload, propertyId)
      } else {
        await createConnection(payload, propertyId)
      }

      queryClient.invalidateQueries(["locks", "rooms"]);
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Room Lock" : "Assign Lock to Room"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {unAssignedLocks?.length > 0 ? (
        <>
          <label htmlFor="">Lock ID:</label>
          <select
            value={selectedLockId}
            onChange={(e) => setSelectedLockId(e.target.value)}
            className="w-100 p-2 cursor-pointer border"
          >
            <option value="" className="cursor-pointer">
              Select a lock
            </option>
            {unAssignedLocks.map((lock) => (
              <option
                key={lock.id}
                value={lock.id}
              >{`Lock Id: ${lock.id} | Serial no. ${lock.serial_number}`}</option>
            ))}
          </select>
        </>
      ): <p>No locks available</p>}

      {unAssignedRooms?.length > 0 ? (
        <>
          <label>Room ID:</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="w-100 p-2 cursor-pointer border"
          >
            <option value="">Select a room</option>
            {unAssignedRooms.map((room) => (
              <option
                key={room.id}
                value={room.id}
              >{`Room Id: ${room.id} || Room no. ${room.room_number}`}</option>
            ))}
          </select>
        </>
      ): <p>No rooms available</p>}
      <input type="hidden" name="lockId" value={selectedLockId} />
      <input type="hidden" name="roomId" value={selectedRoomId} />

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
