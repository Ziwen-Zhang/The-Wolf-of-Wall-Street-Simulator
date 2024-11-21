import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav >
          <Link to="/">
            The Wolf of Wall Street Simulator
          </Link>
    </nav>
  );
};


export default Navbar;
