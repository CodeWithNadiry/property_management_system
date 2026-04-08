import { paramsObj } from "../utils/paramsObj";
import { apiClient } from "./apiclient"

export const createLock = async (data) => {
  const res = await apiClient.post('/locks', data)
  return res.data;
}

export const updateLock = async (id, data) => {
  const res = await apiClient.patch('/locks/'+id, data)
  return res.data;
}

export const getAllLocks = async (propertyId) => {
  const res = await apiClient.get('/locks', paramsObj(propertyId))
  return res.data;
}

export const deleteLock = async (id) => {
  const res = await apiClient.delete('/locks/'+id)
  return res.data
}