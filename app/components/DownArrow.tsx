import { motion } from "framer-motion";
import React from "react";

export default function DownArrow({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, 20, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 8V28"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10 20L18 28L26 20"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
