import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { AiOutlineStock } from "react-icons/ai";

function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-green-400 shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <NavLink
          to="/"
          className="hover:text-yellow-300 transition-colors duration-200"
        >
          The Wolf of Wall Street Simulator
        </NavLink>
      </div>

      {/* search bar and icon */}
      <div className="flex items-center w-1/3 mx-4 space-x-2">

        {/* s */}
        <input
          type="text"
          placeholder="Search bar"
          className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-green-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {/* i */}
        <NavLink
          to="stocks/1"
          className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
        >
          <AiOutlineStock className="w-5 h-5" />
        </NavLink>
      </div>

      {/* user i */}
      <div className="flex items-center space-x-4">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
