/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const SidenavbarCard = ({ header, elements, linkTitle, linkTo }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        <div className="flex items-center">
          {isHovered && <h1 className="font-semibold my-2 text-right w-full rounded-md px-2 bg-gray-300">{header}</h1>}
          {!isHovered && <h1 className="font-semibold my-2 text-right w-full rounded-md px-2 ">{header}</h1>}
        </div>
        {isHovered && (
          <motion.div
            className="absolute left-0 py-2 w-48 bg-white shadow-lg rounded-md z-30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 1 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {elements.map((element, index) => (
              <p key={index} className="p-2 hover:bg-gray-300">
                <Link title={linkTitle} to={linkTo} className="px-4">
                  {element}
                </Link>
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SidenavbarCard;