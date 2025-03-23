import React, { useState } from "react"; 
import axios from "axios"
import { useDispatch } from "react-redux";
import { addUser } from "../src/utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../src/utils/constants";
const Login = ()=> {
  const [emailId, setEmailId] = useState("shifa@gmail.com"); 
  const [password, setPassword] = useState("Shifa@123");
  const [error, setError] = useState("")
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const handleLogin = async ()=>{
    
    try{
      const res = await axios.post(BASE_URL+
        "/login",{
        emailId, 
        password, 
      },
      {withCredentials: true});
      // console.log("Login successful:", res.data); 
      dispatch(addUser(res.data));
      return navigate("/");
    }catch(err){
      setError(err?.response?.data|| "Something went wrong!!");
      console.log(err);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      {/* Card Container */}
      <div className="bg-gray-800 w-96 shadow-lg rounded-2xl p-6">
        <div className="card-body">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
            Login
          </h2>

          {/* Input Fields */}
          <div className="flex flex-col gap-4 w-full">
            <fieldset className="w-full">
              <legend className="text-sm font-medium text-gray-400">
              {/* Email ID: <span className="text-blue-400">{emailId || "Not entered"}</span> */}
              Email ID
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

          {/* Login Button */}
          <p className="text-red-500">{error}</p>
          <div className="mt-6 flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 
