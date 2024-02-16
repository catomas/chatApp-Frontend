import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

interface ChatInputProps {
  handleSendMsg: (msg: string) => void;
}

export const ChatInput = ({ handleSendMsg }: ChatInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject: any, event: any) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const sendChat = (event: any) => {
    event.preventDefault();
    if (msg === "") return;
    handleSendMsg(msg);
    setMsg("");
  };

  return (
    <div className="grid grid-cols-[5%_95%] items-center px-8 pb-8">
      <div className=" flex items-center text-white gap-4">
        <div className="emoji  relative cursor-pointer text-yellow-300 text-2xl">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <EmojiPicker className="emoji" onEmojiClick={handleEmojiClick} />
          )}
        </div>
      </div>
      <form
        onSubmit={(e) => sendChat(e)}
        className="w-full flex items-center gap-8 bg-[#ffffff34] rounded-[2rem]  "
      >
        <input
          type="text"
          placeholder="Type a message"
          className="w-[90%] h-3/5 bg-transparent text-[white] text-[1.2rem] pl-4 border-[none] selection:bg-[#9a86f3] focus:outline-none "
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
        />
        <button className="flex justify-center items-center bg-[#9a86f3] px-8 py-[0.4rem] rounded-[2rem] border-[none]">
          <IoMdSend className=" text-white text-3xl" />
        </button>
      </form>
    </div>
  );
};
