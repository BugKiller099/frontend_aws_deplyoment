import { Provider } from "react-redux";
import Body from "../components/Body";
import Login from "../components/Login";
import Feed from "../components/Feed";
import Profile from "../components/Profile";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import appStore from "./utils/appStore";
function App() {
  
  return (
    <>
      <Provider store={appStore}>
      <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />}/>
        
         </Route>
        
          
      </Routes>
      </BrowserRouter>

      </Provider>
      
      </>
  )
}

export default App;
