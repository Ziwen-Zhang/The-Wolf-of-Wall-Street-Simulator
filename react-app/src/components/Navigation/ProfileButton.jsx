import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Profile Icon */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FaUserCircle className="w-8 h-8" />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <ul
          ref={ulRef}
          className="absolute right-0 mt-2 min-w-[80px] bg-gray-800 rounded-md shadow-lg"
        >
          {user ? (
            <>
              <NavLink
                to="user"
                className="px-4 py-2 text-center text-green-400 hover:text-yellow-300"
              >
                {user.first_name}
              </NavLink>
              {/* <li className="px-4 py-2 text-green-400 hover:text-yellow-300">
                {user.email}
              </li> */}
              <li>
                <button
                  onClick={logout}
                  className="w-full py-2 text-center text-green-400 hover:text-yellow-300 focus:outline-none"
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <div className="flex flex-col gap-2 py-2">
              <button className="w-full text-green-400 hover:text-yellow-300 text-center">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </button>
              <button className="w-full text-green-400 hover:text-yellow-300 text-center">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </button>
            </div>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
