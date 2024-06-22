import React, { useState } from "react";
import { close, menu } from "../../../assets/img";
import { navLinks } from "../../../constants";
import { NavLink } from "react-router-dom";
import styles from "../../../style";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav
      className={`w-full flex py-6 justify-between items-center navbar z-40 fixed md:px-32 xxs:px-5`}
    >
      <a
        href="#home"
        className={`w-[124px] h-[32px] ${styles.respFontLarge} font-bold text-white cursor-pointer ${styles.classicTransition} hover:text-primary-500`}
      >
        Ecar.
      </a>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              styles.classicTransition
            } hover:text-primary-500 ${
              index === navLinks.length - 1 ? "mr-0" : "mr-10"
            } text-white`}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
            {/* <Link
              offset={50}
              duration={750}
              smooth={true}
              spy={true}
              to={`${nav.id}`}
            >
              {nav.title}
            </Link> */}
          </li>
        ))}
        {/* <li
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              styles.classicTransition
            } hover:text-primary-500 text-white`}
          >
            <Link
              offset={50}
              duration={750}
              smooth="easeInOutQuad"
              to="individual"
            >
              individual2
            </Link>
          </li> */}
        <li>
          <NavLink
            to="/login"
            className={`bg-primary-500 rounded-[10px] font-bold py-[8px] px-[24px]
             text-white cursor-pointer text-[16px] ml-10 border-2 
             border-primary-500 hover:text-primary-500 hover:bg-transparent 
             hover:border-primary-500 ${styles.classicTransition}`}
          >
            Login / Sign Up
          </NavLink>
        </li>
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle((prev) => !prev)}
        />
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black top-20 absolute right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-center flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[16px] mb-4
                text-white`}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            <li>
              <NavLink
                to="/login"
                className="bg-primary-500 rounded-[10px] font-bold py-[6px] px-[16px]
                text-white cursor-pointer text-[12px] border-2 
                border-primary-500 hover:text-primary-500 hover:bg-transparent 
                hover:border-primary-500"
              >
                Login / Sign Up
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
