import z from "zod";

export const confirmationSchema = z.object({
  name: z.string().nonempty("name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().nonempty("phone is required"),
  city: z.string().nonempty("city is required"),
  country: z.string().nonempty("country is required"),
  guestNumber: z.coerce
    .number()
    .nonnegative("number of guest needs to be greater than 0"),
});
