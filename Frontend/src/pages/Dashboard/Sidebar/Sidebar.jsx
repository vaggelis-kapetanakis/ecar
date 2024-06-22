import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../../assets/img/logo.svg";
import { AuthContext } from "../../../shared/context/auth-context";
import styles from "../../../style";
import { BsPower, BsTable, BsFillBarChartFill } from "react-icons/bs";
import { MdBatteryChargingFull, MdOutlineEvStation } from "react-icons/md";
import { AiOutlineGift } from "react-icons/ai";

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const activeLink =
    "flex bg-bgBlueLight-500 items-center gap-1 pl-4 space-x-1 py-1 my-4 rounded-2xl text-primary-500";
  const normalLink =
    "flex items-center gap-1 pl-4 space-x-1 py-1 my-4 rounded-2xl text-white";
  const [open, setOpen] = useState(window.innerWidth > 1700 ? false : true);
  return (
    <div
      className="h-screen fixed card-shadow rounded-r-2xl
     transition-all duration-300 ease-in-out z-[999]"
    >
      <>
        <div
          className={` ${
            open
              ? "md:w-[6rem] sm:w-[5rem] ss:w-[4.5rem] xxs:w-[4rem]"
              : "md:w-[13rem] sm:w-40 ss:w-40 xxs:w-40"
          } flex flex-col card-shadow rounded-r-2xl h-full p-3 overflow-y-auto overflow-x-hidden
           bg-darkBlue shadow transition-all duration-300 justify-between`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link
                to="/signedin/dashboard"
                className="flex flex-row items-center justify-start"
              >
                <img
                  src={Logo}
                  alt=""
                  className="md:w-[90px] md:h-[58.88px] xxs:w-[60px] xxs:h-[28.88px]"
                />
                <h2
                  className={
                    open
                      ? "hidden"
                      : `${styles.respFontSmaller} md:ml-4 xxs:ml-2 font-bold text-white block`
                  }
                >
                  Ecar
                </h2>
              </Link>

              <button
                onClick={() => setOpen((prev) => !prev)}
                className="block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="md:w-6 md:h-6 xxs:w-4 xxs:h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h3 className="flex items-center justify-center text-white gap-3 mt-5">
                <span className={open ? "hidden" : "inline-block"}> Type:</span>{" "}
                <span className="text-primary-500">{auth.type}</span>
              </h3>
              <ul className="pt-2 pb-4 space-y-1 text-sm justify-center items-center">
                <li
                  className={`rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  <NavLink
                    to="/signedin/dashboard"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Dashboard
                    </span>
                  </NavLink>
                </li>
                {/* <li
                  className={`${auth.type === "owner" ? "" : "hidden"}
                rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  <NavLink
                    to="/signedin/vehicles"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <AiFillCar className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4" />
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Vehicle Overview
                    </span>
                  </NavLink>
                </li> */}
                <li
                  className={`${auth.type === "owner" ? "" : "hidden"}
                rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  <NavLink
                    to="/signedin/charge"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <MdBatteryChargingFull className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4" />
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Charging Simulator
                    </span>
                  </NavLink>
                </li>
                <li
                  className={`${auth.type === "owner" ? "" : "hidden"}
                rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  {" "}
                  <NavLink
                    to="/signedin/sessions"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <BsTable className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4" />
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Find Sessions
                    </span>
                  </NavLink>
                </li>
                <li
                  className={`${auth.type === "provider" ? "" : "hidden"}
                rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  {" "}
                  <NavLink
                    to="/signedin/stations"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <MdOutlineEvStation className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4" />
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Manage Stations
                    </span>
                  </NavLink>
                </li>
                <li
                  className={`
                rounded-2xl hover:bg-dark1 transition-all duration-300 
                ease-in-out`}
                >
                  <NavLink
                    to="/signedin/charts"
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <BsFillBarChartFill className="md:w-6 md:h-6 text-primary-500 xxs:w-4 xxs:h-4" />
                    <span
                      className={
                        open ? "hidden" : `${styles.respFontExtraSmaller} block`
                      }
                    >
                      Energy Charts
                    </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full flex items-center justify-center pb-3">
            <button
              className={
                open
                  ? "bg-transparent"
                  : `bg-danger-500 font-bold
            py-1 px-10 rounded-xl flex flex-row`
              }
              onClick={auth.logout}
            >
              <BsPower
                className={
                  open
                    ? "md:w-6 md:h-6 text-danger-500 xxs:w-4 xxs:h-4"
                    : `hidden`
                }
              />
              <span
                className={
                  open
                    ? "hidden"
                    : `${styles.respFontExtraSmaller} text-white block`
                }
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default Sidebar;
