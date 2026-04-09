import { useQuery } from "@tanstack/react-query";

export const useList = ({ key, propertyId, extra = [], fn, token }) => {
  return useQuery({
    queryKey: [key, propertyId, ...extra],
    queryFn: fn,
    enabled: !!token && !!propertyId,
  });
};
