import { apiClient } from "./apiclient";

export const createProperty = async (data) => {
  const res = await apiClient.post("/properties", data);
  return res.data.property;
};

export const updateProperty = async (id, data) => {
  const res = await apiClient.patch(`/properties/${id}`, data);
  return res.data.properties;
};

export const deleteProperty = async (id) => {
  const res = await apiClient.delete("/properties/" + id);
  return res.data.message;
};

export const getAllProperties = async () => {
  const res = await apiClient.get("/properties");
  return res.data.properties;
};
