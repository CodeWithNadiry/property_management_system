import { apiClient } from "./apiclient"

export const createUser = async (data, propertyId) => {
  const res = await apiClient.post('/users', data, {
    params: {property_id: propertyId}
  })

  return res.data.users;
}

export const updateUser = async (id, data, propertyId) => {
  const res = await apiClient.patch('/users/'+id, data, {
    params: {property_id: propertyId}
  })

  return res.data.users;
}

export const getAllUsers = async (propertyId) => {
  const res = await apiClient.get('/users', {
    params: {property_id: propertyId}
  })

  return res.data.users
}

export const deleteUser = async (id) => {
  const res = await apiClient.delete('/users/'+id)
  return res.data.message;
}