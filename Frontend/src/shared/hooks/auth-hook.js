import { useCallback, useEffect, useState } from "react";
import axios from "axios";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(false);
  const [points, setPoints] = useState(false);
  const [debt, setDebt] = useState(false);
  const [lastCharge, setLastCharge] = useState(false);
  const [chargesDate, setChargesDate] = useState([]);
  const [type, setType] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback(
    async (
      uid,
      token,
      username,
      points,
      debt,
      lastCharge,
      chargesDate,
      type,
      vehicles,
      expirationDate
    ) => {
      setToken(token);
      setUserId(uid);
      setUsername(username);
      setPoints(points);
      setDebt(debt);
      setLastCharge(lastCharge);
      setChargesDate(chargesDate);
      setType(type);
      setVehicles(vehicles);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      /* const fetchVehicles = (userID) => {
        return axios.get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userID}`);
      }; */

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          username: username,
          points: points,
          debt: debt,
          lastCharge: lastCharge,
          chargesDate: chargesDate,
          type: type,
          vehicles: vehicles,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
      /* localStorage.setItem(
        "userVehicles",
        JSON.stringify({
          userId: uid,
          vehicleId: [],
          brand: [],
          type: [],
          model: [],
        })
      ); */
    },
    []
  );

  const logout = useCallback((uid) => {
    setToken(null);
    let value;
    let userData = localStorage.getItem("userData");
    value = JSON.parse(userData);
    try {
      axios.post(process.env.REACT_APP_BACKEND_URL + `/logout`, null, {
        headers: { "x-observatory-auth": `Bearer ${value.token}` },
      });
    } catch (err) {
      return console.log(err.message);
    }
    setUserId(null);
    setUsername(null);
    setPoints(null);
    setDebt(null);
    setLastCharge(null);
    setChargesDate([]);
    setType(null);
    setVehicles([]);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.username,
        storedData.points,
        storedData.debt,
        storedData.lastCharge,
        storedData.chargesDate,
        storedData.type,
        storedData.vehicles,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
    username,
    points,
    debt,
    lastCharge,
    chargesDate,
    type,
    vehicles,
  };
};
