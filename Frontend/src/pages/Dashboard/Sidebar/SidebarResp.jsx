import React, { useState, useContext } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { BsPower, BsTable, BsFillBarChartFill } from "react-icons/bs";
import {
  MdBatteryChargingFull,
  MdOutlineEvStation,
  MdClose,
} from "react-icons/md";
import styles from "../../../style";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../shared/context/auth-context";

const SidebarResp = () => {
  const auth = useContext(AuthContext);
  const activeLink =
    "flex bg-bgBlueLight-500 items-center gap-1 pl-4 space-x-1 py-1 my-4 rounded-lg text-primary-500";
  const normalLink =
    "flex items-center gap-1 pl-4 space-x-1 py-1 my-4 rounded-xl text-white";
  const [open, setOpen] = useState(false);
  return (
    <div
      className="fixed right-4 top-7 card-shadow rounded-r-2xl
    transition-all duration-300 ease-in-out z-[999999]"
    >
      <div className="w-12 h-12 bg-navOp-500 border-2 border-bgBlueLight-500 rounded-[50%] flex items-center justify-center">
        {open ? (
          <MdClose
            className="text-danger-500 w-6 h-6 rotate-180"
            onClick={() => setOpen(false)}
          />
        ) : (
          <HiOutlineMenuAlt1
            className="text-primary-500 w-6 h-6 rotate-180"
            onClick={() => setOpen(true)}
          />
        )}
      </div>
      {open && (
        <div className="w-48 text-white fixed right-16 top-[3.1rem] z-[999999]">
          <motion.div
            initial={{
              opacity: 0,
              borderTop: "solid 3px rgba(245,245,245,0.85)",
              scaleX: 0,
            }}
            animate={{
              opacity: 1,
              borderTop: "solid 3px rgba(245,245,245,0.85)",
              borderStyle: "rounded",
              scaleX: 1,
              transition: { ease: "backOut", duration: 0.3 },
            }}
            exit={{
              borderTop: "solid 3px rgba(245,245,245,0.85)",
              scaleX: 0,
              transition: { ease: "easeInOut", duration: 0.3 },
            }}
          >
            <motion.div
              className="w-48 h-56 rounded-xl border-2 border-bgBlueLight-500"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: 1,
                background: "rgb(1,1,30)",
                scaleY: 1,
                transition: { ease: "backOut", duration: 0.3, delay: 0.1 },
              }}
              exit={{
                scaleX: 0,
                transition: { ease: "backOut", duration: 0.3 },
              }}
            >
              <div className="w-full h-full py-2 px-1 overflow-auto">
                <ul className="pt-2 pb-4 space-y-1 text-sm justify-center items-center">
                  <li
                    className={`hover:bg-dark1 transition-all duration-300 
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
                      <span className={`${styles.respFontExtraSmaller}`}>
                        Dashboard
                      </span>
                    </NavLink>
                  </li>
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
                      <span className={`${styles.respFontExtraSmaller}`}>
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
                      <span className={`${styles.respFontExtraSmaller}`}>
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
                      <span className={`${styles.respFontExtraSmaller}`}>
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
                      <span className={`${styles.respFontExtraSmaller}`}>
                        Energy Charts
                      </span>
                    </NavLink>
                  </li>
                </ul>
                <div className="w-full flex items-center justify-center pb-3">
                  <button
                    className="bg-danger-500 font-bold
              py-1 px-7 rounded-xl flex flex-row gap-5"
                    onClick={auth.logout}
                  >
                    <BsPower className="text-white font-bold w-4 h-4" />
                    <span className={`${styles.respFontExtraSmaller}`}>
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SidebarResp;
