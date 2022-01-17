import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getSender } from '../common/Config';
import axios from 'axios';
import UserImg from '../asset/image/userimg.png'


export default function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get("http://localhost:3111/chat/fetchchat", config);
      // console.log("fetchchat data:", data)
      setChats(data);
    } catch (error) {
      console.log("fecth api", error)
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);


  return (
    <>
      <div className='mychat_heading' >
        <h2 className="chatheadeing">Chat</h2>
      </div>
      <hr />
      <div className=' myChat'>
        <div className='chat_container'>
          {chats.map((e) => {
            //  console.log("eeeeeeeeee mychat", e)
            return (

              <div onClick={() => setSelectedChat(e)} key={e._id} className='mychat_container'>
                <div className='sendercontaner '>
                  <span ><img className='userimg' alt='img' src={UserImg} /></span>
                  {getSender(loggedUser, e.users)}
                </div>
              </div>


            )
          })}



        </div>

      </div>

    </>
  )
}





















