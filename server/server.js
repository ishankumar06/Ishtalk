// import { createContext,useState,useEffect } from "react";
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { connect, io } from 'socket.io-client';

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
   
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [authUser, setAuthUser] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [socket, setSocket] = useState(null);

   
//   // check if user is authenticated and if so, set the user data and connect the socket
  
//   const checkAuth = async () => {
//     try {
//       const {data} = await axios.get("/api/auth/check");
//       if(data.success) {
//         setAuthUser(data.user)
//         connectSocket(data.user);
//       }
      
//     } catch (error) {
//       toast.error(error.message);
//     }

//   }

//   //login function to handle user authentication and socket connection
//   const login = async (state, credentials) => {
//        try {
//             const { data } = await axios.post(`/api/auth/${state}`, credentials);
//             if(data.success){
//               setAuthUser(data.user);
//               connectSocket(data.user);
//               axios.defaults.headers.common["token"]= data.token;
//               setToken(data.token);
//               localStorage.setItem("token", data.token);

//               toast.success(data.message);
//             }
//             else{
//               toast.error(data.message);
//             } 
//        } catch (error) {
//            toast.error(error.message);
//        }
//   }


//   // logout function to handle user logout and socket disconnection
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setAuthUser(null);
//     setOnlineUsers([]);
//     axios.defaults.headers.common["token"]= null;
//     toast.success("Logged out successfully");
//     socket.disconnect();
//   }


//   // update profile function to handle user profile updates
//   const updateProfile = async (body) => {
//     try {
//       const { data } = await axios.put("/api/auth/update-profile", body);
//       if(data.success){
//         setAuthUser(data.user);
//         toast.success(data.message);
//       }

//   }
//   catch (error) {

//     toast.error(error.message);
//   }
//   }



//   //connect socket function to handle socket connection and online users updates 

//   const connectSocket = (userData) => {
//        if(!userData || socket?.connected) return;
//        const newSocket = io(backendUrl,{
//           userId  : userData._id,
//        });

//        newSocket.connect();
//        setSocket(newSocket);

//        newSocket.on("getOnlineUsers", (userIds)=>{
//           setOnlineUsers(userIds);
//        })
//   }


//   useEffect(()=>{
//     if(token){
//       axios.defaults.headers.common["token"]= token;
//     }
//     checkAuth();

//   })
 

//    const value ={
//          axios,
//          authUser,
//          onlineUsers,
//          socket,
//           login,
//           logout,
//           updateProfile,
//    }
//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     )
//   }









import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// create Express app and Http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server with CORS enabled
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {}; // key: userId, value: socketId

// JWT authentication middleware for socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("jwt must be provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId || decoded._id; // adapt to your JWT payload structure
    next();
  } catch (err) {
    next(new Error("invalid jwt"));
  }
});

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Healthcheck route
app.use("/api/status", (req, res) => res.send("server is live"));

// Routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to mongodb
await connectDB();

if(process.env.NODE_ENV !== "production"){
    
  const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log("Server is running on PORT:" + PORT)
);

}

// Export server for versel
export default server;
