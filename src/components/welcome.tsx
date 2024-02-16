import { User } from "../lib/interfaces";
import Hi from "../assets/hi.gif";

interface WelcomeProps {
  user: User | undefined;
}

export const Welcome = ({ user }: WelcomeProps) => {
  return (
    <div className=" flex justify-center items-center flex-col  text-white">
      <img src={Hi} alt="hi" />
      <h1 className=" text-3xl mt-6">
        Welcome <span className=" text-purple-400">{user?.username}!</span>
      </h1>
      <h3 className="text-xl">You can start chatting with your friends now.</h3>
    </div>
  );
};
