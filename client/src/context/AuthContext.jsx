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







import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // login function to handle authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        connectSocket(data.user);
      } else {
        toast.error(data.message);
      } 
    } catch (error) {
      toast.error(error.message);
    }
  }

  // logout function to handle logout and socket disconnect
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    if(socket) socket.disconnect();
  }

  // update profile function
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // connect socket function with JWT token in auth option
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      auth: {
        token: localStorage.getItem("token"),
      }
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
