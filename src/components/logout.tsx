import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

import { Socket } from "socket.io-client";

import { User } from "@/lib/interfaces";

interface LogoutProps {
  socket: React.MutableRefObject<Socket | undefined>;
  currentUser: User;
}

export const Logout = ({ socket, currentUser }: LogoutProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.removeItem("chat-app-user");

    socket.current?.disconnect();
    navigate("/login");
  };

  return (
    <div className=" flex justify-center items-center p-2 rounded-lg bg-violet-400 cursor-pointer ">
      <BiPowerOff onClick={handleClick} className="text-3xl text-white" />
    </div>
  );
};
