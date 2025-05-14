import io from "socket.io-client";
import { VITE_SOCKET_URL } from "./constants";

// export const createSocketConnection =()=>{
//     return io(BASE_URL);
// };

export const createSocketConnection = () => {
    return io(VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  };
  