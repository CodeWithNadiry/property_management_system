import { paramsObj } from "../utils/paramsObj";
import { apiClient } from "./apiclient"

export const createReservation = async (data, propertyId) => {
  const res = await apiClient.post('/reservations', data, {
    params: {property_id: propertyId}
  })

  return res.data.reservations;
}

export const updateReservation = async (id, data, propertyId) => {
  const res = await apiClient.patch('/reservations/'+id, data, {
    params: {property_id: propertyId}
  })

  return res.data
}

export const getAllReservations = async (propertyId) => {
  const res = await apiClient.get('/reservations/', paramsObj(propertyId))

  return res.data.reservations;
}