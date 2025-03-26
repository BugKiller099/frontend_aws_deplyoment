import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../src/utils/constants";
import axios from "axios";
import { removeUser } from "../src/utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <nav className="navbar bg-base-300 shadow-md transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link 
            to="/" 
            className="btn btn-ghost text-xl flex items-center space-x-2 hover:bg-base-200 rounded-lg transition-all"
          >
            <span className="text-2xl">👨‍💻</span>
            <span className="font-bold tracking-tight">Developer's Club</span>
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium opacity-80 hidden md:block">
              Welcome, {user.firstName}
            </div>
            
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar transition-transform hover:scale-105"
              >
                <div className="w-10 rounded-full ring-2 ring-base-300 ring-offset-2">
                  <img
                    src={user.photoUrl}
                    alt="User avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              <ul 
                tabIndex={0} 
                className="menu menu-sm dropdown-content bg-base-100 rounded-xl w-56 p-2 shadow-lg border border-base-200 mt-3 space-y-1"
              >
                <li>
                  <Link 
                    to="/profile" 
                    className="flex justify-between items-center hover:bg-base-200 rounded-md"
                  >
                    Profile
                    <span className="badge badge-primary badge-sm">New</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/connections" 
                    className="hover:bg-base-200 rounded-md"
                  >
                    Friends
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/requests" 
                    className="hover:bg-base-200 rounded-md"
                  >
                    Requests
                  </Link>
                </li>
                <li>
                  <a 
                    onClick={handleLogout} 
                    className="hover:bg-base-200 rounded-md text-error"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;