import { ProjectMessages, User } from "../lib/interfaces";
import { Logout } from "./logout";
import { ChatInput } from "./chat_Input";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { getAllMessagesRoute, sendMessagesRoute } from "../lib/api_routes";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
interface ChatContainerProps {
  currentChat: User;
  currentUser: User;
  socket: React.MutableRefObject<Socket | undefined>;
}

export const ChatContainer = ({
  currentChat,
  currentUser,
  socket,
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<ProjectMessages[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<ProjectMessages>();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat) {
      const response = async () => {
        return await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
      };

      response().then((res) => {
        setMessages(res.data);
      });
    }
  }, [currentChat]);

  const handleSendMsg = async (msg: string) => {
    const data = await JSON.parse(localStorage.getItem("chat-app-user")!);
    await axios.post(sendMessagesRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current?.emit("send-msg", {
      from: data._id,
      to: currentChat._id,
      username: data.username,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      const handleNewMessage = (data: any) => {
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
        });

        toast(`New message from ${data.username}: ${data.message}`);
      };

      socket.current.on("msg-recieve", handleNewMessage);

      return () => {
        socket.current?.off("msg-recieve", handleNewMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className=" grid grid-rows-[10%_78%_12%]   overflow-hidden">
        <div className=" flex justify-between items-center px-8 py-4">
          <div className=" flex items-center gap-4">
            <img
              className="h-12"
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
            <h3 className=" text-white">{currentChat.username}</h3>
          </div>
          <Logout socket={socket} currentUser={currentUser} />
        </div>
        <div className=" chat-messages px-8 py-2 flex flex-col gap-4 overflow-auto">
          {messages.map((message) => {
            return (
              <div
                key={uuidv4()}
                ref={scrollRef}
                className={` flex items-center  ${
                  message.fromSelf ? " justify-end " : " justify-start "
                } `}
              >
                <div
                  className={`max-w-[40%] break-words text-lg text-[#d1d1d1] p-4 rounded-2xl ${
                    message.fromSelf ? "  bg-[#4f04ff21]" : " bg-[#9900ff20]"
                  }`}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
      <ToastContainer />
    </>
  );
};
