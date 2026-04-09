import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isLoggedIn: false,

      login: (data) => {
        set({
          user: data.user,
          token: data.token,
          role: data.user.role,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;

// 1️⃣ Zustand store without persist
// import { create } from "zustand";

// const storedAuth = JSON.parse(localStorage.getItem("auth-storage")) || null;

// const useAuthStore = create((set) => ({
//   user: storedAuth?.user || null,
//   token: storedAuth?.token || null,
//   role: storedAuth?.role || null,
//   isLoggedIn: storedAuth?.isLoggedIn || false,

//   login: (data) => {
//     const authData = {
//       user: data.user,
//       token: data.token,
//       role: data.user.role,
//       isLoggedIn: true,
//     };

//     localStorage.setItem("auth-storage", JSON.stringify(authData));

//     set(authData);
//   },

//   logout: () => {
//     localStorage.removeItem("auth-storage");

//     set({
//       user: null,
//       token: null,
//       role: null,
//       isLoggedIn: false,
//     });
//   },
// }));

// export default useAuthStore;
