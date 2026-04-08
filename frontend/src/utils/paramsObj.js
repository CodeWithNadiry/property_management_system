export function paramsObj(propertyId) {
  return {
    params: { property_id: propertyId },
  };
}

// import usePropertyStore from "../store/PropertyStore";
// apiClient.interceptors.request.use((config) => {
//   const propertyId = usePropertyStore.getState().activePropertyId;

//   if (propertyId) {
//     config.params = {
//       ...config.params,
//       property_id: propertyId,
//     };
//   }

//   return config;
// });

// export const createReservation = async (data) => {
//   const res = await apiClient.post('/reservations', data);
//   return res.data.reservations;
// };

// export const updateReservation = async (id, data) => {
//   const res = await apiClient.patch('/reservations/' + id, data);
//   return res.data;
// };

// export const getAllReservations = async () => {
//   const res = await apiClient.get('/reservations/');
//   return res.data.reservations;
// };
