import { Welcome } from "../components/welcome";
import { Contacts } from "../components/contacts";
import { allUsersRoute, host } from "../lib/api_routes";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../lib/interfaces";
import { ChatContainer } from "../components/chat_container";
import { Socket, io } from "socket.io-client";

export const Chat = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<User[] | []>([]);
  const [currentUser, setCurrentUser] = useState<undefined | User>(undefined);
  const [currentChat, setCurrentChat] = useState<User | undefined>(undefined);
  //const [isLoading, setIsLoading] = useState(false);
  const socket = useRef<Socket | undefined>();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")!));
      //  setIsLoading(true);
    }
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(
            `${allUsersRoute}/${currentUser._id}`
          );
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat: User) => {
    setCurrentChat(chat);
  };

  return (
    <div className=" flex flex-col justify-center h-screen w-screen gap-4 items-center ">
      <div className=" h-[85%] w-[85%] bg-slate-900 grid grid-cols-[35%_65%]  md:grid-cols-[25%_75%]  ">
        <Contacts
          socket={socket}
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome user={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser!}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};
