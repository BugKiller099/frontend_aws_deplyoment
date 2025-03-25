import React, { useState } from "react"; 
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../src/utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../src/utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("shifa@gmail.com"); 
  const [password, setPassword] = useState("Shifa@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const [isloginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!!");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`, 
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      ); 
      
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 w-96 shadow-lg rounded-2xl p-6">
        <div className="card-body">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
            {isloginForm ? "Login" : "Signup"}
          </h2>
          
          <div className="flex flex-col gap-4 w-full">
            {!isloginForm && (
              <>
                <fieldset className="w-full">
                  <legend className="text-sm font-medium text-gray-400">
                    First Name
                  </legend>
                  <input
                    type="text"
                    value={firstName}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter first name"
                    onChange={(e) => setFirstName(e.target.value)} 
                  />
                </fieldset>
                <fieldset className="w-full">
                  <legend className="text-sm font-medium text-gray-400">
                    Last Name
                  </legend>
                  <input
                    type="text"
                    value={lastName}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter last name"
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </fieldset>
              </>
            )}
           
            <fieldset className="w-full">
              <legend className="text-sm font-medium text-gray-400">
                Email Id
              </legend>
              <input
                type="email"
                value={emailId}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                onChange={(e) => setEmailId(e.target.value)} 
              />
            </fieldset>
            <fieldset className="w-full">
              <legend className="text-sm font-medium text-gray-400">
                Password
              </legend>
              <input
                type="password"
                value={password}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>

          <p className="text-red-500">{error}</p>
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition w-full"
              onClick={isloginForm ? handleLogin : handleSignUp}
            >
              {isloginForm ? "Login" : "Signup"}
            </button>

            <p 
              className="text-gray-400 cursor-pointer hover:text-white transition"
              onClick={() => setIsLoginForm(value => !value)}
            >
              {isloginForm ? "New User? Signup here" : "Existing user login here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;