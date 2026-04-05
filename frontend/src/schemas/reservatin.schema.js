import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().nonempty("Phone is required"),
  room_id: z.coerce.number().positive().refine(val => val > 0, {
    message: "Room is required",
  }),
  check_in: z.string().nonempty("Check-in is required"),
  check_out: z.string().nonempty("Check-out is required"),
}).refine(
  (data) => new Date(data.check_out) > new Date(data.check_in),
  {
    message: "Check-out must be after check-in",
    path: ["check_out"],
  }
);