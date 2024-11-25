import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { AiOutlineStock } from "react-icons/ai";
import NotificationDropdown from "./NotificationDropdown";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";

function Navigation() {
  const user = useSelector((state) => state.session.user); // Get user from Redux state

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

      {/* Search bar and icons */}
      <div className="flex items-center w-1/3 mx-4 space-x-2">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search bar"
          className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-green-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {/* Icons */}
        {user && ( // Show icons only if user exists
          <>
            <NavLink
              to="stocks/1"
              className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
            >
              <AiOutlineStock className="w-5 h-5" />
            </NavLink>
            <NotificationDropdown />
            <NavLink
              to="watchlist"
              className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
            >
              <FaClipboardList className="w-5 h-5" />
            </NavLink>
            <NavLink
              to="history"
              className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
            >
              <AiOutlineTransaction className="w-5 h-5" />
            </NavLink>
          </>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
