import { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo.png";
import { User } from "../lib/interfaces";
import { Socket, io } from "socket.io-client";
import { host } from "../lib/api_routes";

interface ContactsProps {
  contacts: User[];
  currentUser?: User;
  socket: React.MutableRefObject<Socket | undefined>;
  changeChat: (chat: User) => void;
}

export const Contacts = ({
  contacts,
  currentUser,
  changeChat,
  socket,
}: ContactsProps) => {
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(
    undefined
  );
  const [usersOnline, setUsersOnline] = useState<string[]>([]);

  const sockete = useRef<Socket | undefined>();

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  const changeCurrentChat = (index: number, contact: User) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  useEffect(() => {
    sockete.current = io(host);
    if (sockete.current) {
      sockete.current?.emit("get-users-online");

      sockete.current?.on("users-online", (users) => {
        setUsersOnline(users);
      });
    }
  }, []);
  return (
    <>
      {currentUserImage && currentUserName && (
        <div className="grid grid-rows-[13%_72%_15%] overflow-hidden   bg-violet-950 ">
          <div className="flex items-center gap-4 justify-center mt-4">
            <img src={Logo} alt="logo" className="h-full " />
          </div>
          <div className="flex flex-col items-center overflow-auto gap-[0.8rem] mt-4 contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  className={` bg-[#ffffff34] min-h-[5rem] cursor-pointer w-[90%] flex gap-4 items-center transition-[0.5s] duration-[ease-in-out] p-[0.4rem] rounded-[0.2rem] ${
                    index === currentSelected ? " bg-violet-400" : ""
                  }`}
                  key={index}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      className=" h-12"
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3 className=" text-white">{contact.username}</h3>
                  </div>

                  {usersOnline.find((id) => id === contact._id) && (
                    <span className="bg-green-500 h-3 w-3 rounded-full block"></span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="  bg-violet-800 flex justify-center items-center gap-8">
            <div>
              <img
                className="h-16"
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className=" text-white">
              <h3>{currentUserName}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
