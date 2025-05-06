import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toastSuccessNotify } from "../helper/ToastNotify";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import Switch from "./Switch";
import avatar from "../assets/avatar.png"; // Import your avatar image

const Navbar = () => {
  const { currentUser, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      toastSuccessNotify("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-neutral-100 dark:bg-gray-900 py-3 dark:text-white w-full">
      <div className="flex w-full flex-wrap items-center justify-between px-6">
        {/* App Logo/Title - with minimal padding */}
        <Link to="/" className="pr-2 text-2xl font-semibold">
          React Movie App
        </Link>

        {/* Right side - Switch and Profile/Auth */}
        <div className="relative flex items-center">
          <Switch />

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center focus:outline-none">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={currentUser?.photoURL || avatar}
                alt="User profile"
                onError={(e) => {
                  e.target.src = avatar;
                }}
              />
              {/* Show user's name next to the avatar */}
              {currentUser && (
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                  {currentUser.displayName || "User"}
                </span>
              )}
            </MenuButton>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                {currentUser ? (
                  <>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } text-gray-700 dark:text-gray-200`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } text-gray-700 dark:text-gray-200`}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/login"
                          className={`block px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } text-gray-700 dark:text-gray-200`}
                        >
                          Login
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/register"
                          className={`block px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } text-gray-700 dark:text-gray-200`}
                        >
                          Register
                        </Link>
                      )}
                    </MenuItem>
                  </>
                )}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
