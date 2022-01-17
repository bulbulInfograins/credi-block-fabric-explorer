import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext(); // step 1

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats,setChats]=useState([]);
  const history = useHistory();
   
  useEffect( async () => {
    const userInfo = await JSON.parse(sessionStorage.getItem("userInfo"));
    console.log("Login user ",userInfo)
    setUser(userInfo);    //fetch localstroage
    if (userInfo === "") {history.push("/")}
  }, [history]);  

  return (
    <ChatContext.Provider value={{ user,setUser,selectedChat, setSelectedChat ,chats,setChats}}>  
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
