import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { AiOutlineStock } from "react-icons/ai";
import NotificationDropdown from "./NotificationDropdown";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { MdLeaderboard } from "react-icons/md";

function Navigation() {
  const user = useSelector((state) => state.session.user); // 从 Redux 获取用户状态
  const [mainTitle, setMainTitle] = useState(
    "The Wolf of Wall Street Simulator"
  ); // 主标题状态

  useEffect(() => {
    if (user) {
      const maxDebt = 1000000; // 假设最大 debt 为 1000000
      const initialNetWorth = 100000; // 初始净资产
      const totalLossPercentage =
        ((initialNetWorth - user.total_net_worth) / initialNetWorth) * 100;

      if (user.bank_debt >= maxDebt && totalLossPercentage > 90) {
        setMainTitle("Quit Gambling Simulator");
        document.title = "Quit Gambling Simulator";
      } else {
        setMainTitle("The Wolf of Wall Street Simulator");
        document.title = "The Wolf of Wall Street Simulator";
      }
    }
  }, [user]);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-green-400 shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <NavLink
          to="/"
          className="hover:text-yellow-300 transition-colors duration-200"
        >
          {mainTitle}
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
        <NavLink
          to="stocks/1"
          className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
          title="Browse Stocks"
        >
          <AiOutlineStock className="w-5 h-5" />
        </NavLink>
        <NavLink
          to="leaderboard"
          className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
          title="Leaderboard"
        >
          <MdLeaderboard className="w-5 h-5" />
        </NavLink>
        {/* Icons */}
        {user && (
          <>
            <div title="Notifications">
              <NotificationDropdown />
            </div>
            <NavLink
              to="watchlist"
              className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
              title="Watchlist"
            >
              <FaClipboardList className="w-5 h-5" />
            </NavLink>
            <NavLink
              to="history"
              className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200"
              title="Order History"
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
