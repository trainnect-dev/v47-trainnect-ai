// Mock for framer-motion
const motion = {
  div: ({ children, ...props }) => children,
};

const AnimatePresence = ({ children }) => children;

module.exports = {
  motion,
  AnimatePresence,
};
