import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  username: null,
  points: null,
  debt: null,
  lastCharge: null,
  chargesDate: [],
  type: null,
  vehicles: [],
  login: () => {},
  logout: () => {},
});
