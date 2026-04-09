import { paramsObj } from "../utils/paramsObj";
import { apiClient } from "./apiclient";

export const createConnection = async (data, propertyId) => {
  const res = await apiClient.post(
    "/room-lock/assign",
    data,
    paramsObj(propertyId),
  );
  return res.data.connection;
};

export const editConnection = async (id, data, propertyId) => {
  const res = await apiClient.patch(
    "/room-lock/edit-assign/" + id,
    data,
    paramsObj(propertyId),
  );
  return res.data.connection;
};

export const deleteConnection = async (id) => {
  const res = await apiClient.delete("/room-lock/unassign/" + id);
  return res.data.message;
};

export const getAllConnections = async (propertyId) => {
  const res = await apiClient.get("/room-lock", paramsObj(propertyId));
  return res.data.connections;
};

export const getUnAssignedLocks = async (propertyId) => {
  const res = await apiClient.get(
    "/room-lock/unassigned-locks",
    paramsObj(propertyId),
  );
  return res.data.unAssignedLocks;
};

export const getUnAssignedRooms = async (propertyId) => {
  const res = await apiClient.get(
    "/room-lock/unassigned-rooms",
    paramsObj(propertyId),
  );
  return res.data.unAssignedRooms;
};
