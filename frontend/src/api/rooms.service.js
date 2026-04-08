import { apiClient } from "./apiclient";

export const createRoom = async (data, propertyId) => {
  const res = await apiClient.post("/rooms", data, {
    params: { property_id: propertyId },
  });

  return res.data;
};

export const updateRoom = async (id, data, propertyId) => {
  const res = await apiClient.patch("/rooms/" + id, data, {
    params: { property_id: propertyId },
  });

  return res.data;
};

export const getAllRooms = async (propertyId) => {
  const res = await apiClient.get("/rooms", {
    params: { property_id: propertyId },
  });

  return res.data.rooms;
};

export const deleteRoom = async (id) => {
  const res = await apiClient.delete(`/rooms/${id}`);
  return res.data.message;
};
