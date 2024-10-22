/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const GradualText = ({ text }) => {
  return (
    <div>
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: 2,
            delay: index * 0.1,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

export default GradualText;