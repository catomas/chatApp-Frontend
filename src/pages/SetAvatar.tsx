import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../lib/api_routes";

export const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(
    undefined
  );

  const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user")!);
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error(
          "Error setting profile picture. Please try again ",
          toastOptions
        );
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}?apikey=0awE52IkzUhqLx`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, [navigate]);
  return (
    <>
      <div className="flex justify-center items-center flex-col gap-8  h-screen w-screen">
        {isLoading ? (
          <div>
            <img src={loader} alt="loader" />
          </div>
        ) : (
          <>
            <h1 className=" text-white text-4xl ">
              Pick an avatar as your profile picture
            </h1>
            <div className=" flex gap-8 ">
              {avatars.map((avatar, index) => {
                return (
                  <div
                    key={index}
                    className={` cursor-pointer  flex justify-center items-center  p-[0.4rem] rounded-[5rem]  border-[0.8rem]     ${
                      selectedAvatar === index
                        ? " border-[#b54dbf]"
                        : "border-gray-700 "
                    }`}
                  >
                    <img
                      className="h-24 "
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt="avatar"
                      onClick={() => {
                        setSelectedAvatar(index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={setProfilePicture}
              className=" bg-purple-600 text-white  text-xl cursor-pointer   px-8 py-4 rounded-[0.4rem] border-[none] hover:bg-purple-700 transition-[0.5s] duration-[ease-in-out]"
            >
              Set Profile Picture
            </button>
          </>
        )}
      </div>

      <ToastContainer />
    </>
  );
};
