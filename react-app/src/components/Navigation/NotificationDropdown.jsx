import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsReadThunk,
} from "../../redux/notification";
import { FaBell } from "react-icons/fa";

function NotificationDropdown() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );
    setFilteredNotifications(unreadNotifications);
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsReadThunk(notificationId));
  };

  const handleClearAll = () => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        dispatch(markNotificationAsReadThunk(notification.id));
      }
    });
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon */}
      <button onClick={toggleDropdown} className="relative focus:outline-none">
        <span className="flex items-center p-2 text-green-400 hover:bg-gray-800 hover:text-yellow-400 rounded-md transition-all duration-200">
          <FaBell />
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="flex justify-between items-center bg-gray-900 px-4 py-2">
            <h3 className="text-teal-400 font-bold">Messages</h3>
            <button
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-600 text-sm font-semibold"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-gray-700">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`px-4 py-3 ${
                  notification.read ? "bg-gray-700" : "bg-gray-800"
                } hover:bg-gray-900`}
              >
                <div className="flex justify-between items-center">
                  <p>
                    {`${notification.stock_name} has ${
                      notification.alert_type === "above"
                        ? "risen above"
                        : "dropped below"
                    } $${notification.target_price.toFixed(2)}.`}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {filteredNotifications.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No unread notifications
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
