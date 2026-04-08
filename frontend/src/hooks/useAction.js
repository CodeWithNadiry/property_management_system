import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAction = ({ fn, key, propertyId }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (message) => {
      queryClient.invalidateQueries([key, propertyId]);
      if (message) {
        alert(message);
      }
    },
    onError(err) {
      alert(err.response?.data?.message)
    }
  });
};
