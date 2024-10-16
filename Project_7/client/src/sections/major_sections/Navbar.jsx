/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import HeroImage from "../../assets/images/Profile.jpg";
import LogoImage from "../../assets/images/Kat1NoBg.png";
import { motion } from "framer-motion";
import NavbarCard from "../../components/cards/NavbarCard.jsx";
import SidenavbarCard from "../../components/cards/SidenavbarCard.jsx";
import {NAVBAR_DROPLISTS} from "../../constants/index.js";

const Navbar = ({
  scrollToAboutMe,
  scrollToProjects,
  scrollToContact,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleTargetContact = () => {
    if (scrollToContact.current) {
      scrollToContact.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    if (confirm("Are you sure you want to log out?")) {
      setUser({
        name: null,
      });

      localStorage.removeItem("name");
      localStorage.removeItem("webToken");

      navigate("/");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="bg-transparent text-white fixed w-full top-0 z-20 rounded-md shadow-lg">
        <nav className="flex justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="bg-transparent">
              <Link title="Home" to="/">
                <img
                  src={LogoImage}
                  alt="Logo"
                  className="h-8 w-8 bg-transparent object-cover rounded-full bg-slate-200"
                />
              </Link>
            </span>
            <Link title="Home" to="/">
              <span className="text-slate-700 text-lg">MicroService</span>
            </Link>

            {user.name && (
              <span className="inline-block ml-2">
                <Link title="Visit Profile" to="/user/profile">
                  <img
                    src={HeroImage}
                    alt="Ishrak Adit"
                    className="h-6 w-6 object-cover rounded-full shadow-lg"
                  />
                </Link>
              </span>
            )}
          </div>

          {/* Full Navbar for large screens */}
          <div className="hidden lg:flex items-center gap-8 text-slate-700">
            {user.name ? (
              <>
                {NAVBAR_DROPLISTS.map((element, index) => (
                  <NavbarCard
                    key={index}
                    header={element.header}
                    elements={element.elements}
                    linkTitle={"User Profile"}
                    linkTo={"/user/profile"}
                  />
                ))}
                <button
                  title="Log out"
                  onClick={handleLogOut}
                  className="fa-solid fa-right-from-bracket nav-link"
                ></button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent rounded-lg hover:bg-slate-200 focus:outline-none hover:text-slate-700"
                >
                  <Link title="Log in" to="/login" className="px-4">
                    Log in
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent rounded-lg hover:bg-slate-200 focus:outline-none hover:text-slate-700"
                >
                  <Link title="Register" to="/register" className="px-4">
                    Register
                  </Link>
                </motion.button>
              </div>
            )}
          </div>

          {/* Menu Icon for smaller screens */}
          <div className="lg:hidden flex items-center items-center gap-8 text-slate-700">
            {!isMenuOpen && (
              <button
                onClick={toggleMenu}
                className="text-slate-700 focus:outline-none"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            )}

            {isMenuOpen && (
              <button
                onClick={toggleMenu}
                className="text-slate-300 focus:outline-none"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            )}

            <button
              title="Log out"
              onClick={handleLogOut}
              className="fa-solid fa-right-from-bracket nav-link"
            ></button>
          </div>
        </nav>

        {/* Dropdown Menu for smaller screens */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white text-slate-700 shadow-lg rounded-md p-4 w-1/2 absolute right-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {user.name ? (
              <>
                {NAVBAR_DROPLISTS.map((element, index) => (
                  <SidenavbarCard
                    key={index}
                    header={element.header}
                    elements={element.elements}
                    linkTitle={"User Profile"}
                    linkTo={"/user/profile"}
                  />
                ))}
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  title="Log in"
                  to="/login"
                  className="bg-transparent rounded-lg hover:bg-slate-200 focus:outline-none hover:text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  title="Register"
                  to="/register"
                  className="bg-transparent rounded-lg hover:bg-slate-200 focus:outline-none hover:text-slate-700"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </header>
    </div>
  );
};

export default Navbar;