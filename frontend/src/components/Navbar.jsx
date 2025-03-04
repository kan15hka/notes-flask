import React, { useState } from "react";
import LogoImg from "../assets/logo.png";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toastType } from "../helper/helper";
import { axiosInstance } from "../apis/axiosInstance";
import { getUserFromLocalStorage } from "../helper/auth";
import InputField from "./InputField";

export default function Navbar({ setShowToast }) {
  const [search, setSearch] = useState("");
  const { user, loadUser, removeUser } = useAuth();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const userData = getUserFromLocalStorage();
      const accessToken = userData?.accessToken;
      const refreshToken = userData?.refreshToken;

      const accessTokenLogoutResponse = await axiosInstance.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      //  This block of code triggers the generation of new accessToken again which results in
      // signature verification failure error and hence the refres token is not put in BLOCKLIST(no expiry)

      // const refreshTokenLogoutResponse = await axiosInstance.post(
      //   "/logout-refresh",
      //   {},
      //   { headers: { Authorization: `Bearer ${refreshToken}` } }
      // );
      removeUser();
      setShowToast({
        isShown: true,
        message:
          accessTokenLogoutResponse.data.message || "Logged out successfully",
        type: toastType.SUCCESS,
      });

      setTimeout(() => navigate("/login"), 1500); // Navigate after toast
    } catch (error) {
      // console.log(error);
      setShowToast({
        isShown: true,
        message: error?.response?.data?.message || "Logout Failed",
        type: toastType.ERROR,
      });
    }
  };
  // const handleSearch = (value) => {
  //   setSearch(value);
  //   if (!value) {
  //     setSearchedNotes(notes); // Reset to all notes when input is empty
  //     return;
  //   }
  //   // Handle the filtering logic here if necessary
  //   const filteredNotes = notes.filter((note) =>
  //     note.title.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setSearchedNotes(filteredNotes);
  // };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 border-b-2 border-black">
      <div className="flex items-center space-x-2">
        <img src={LogoImg} className="h-10" />
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </div>

      {/* <InputField
        isPasswordField={false}
        value={search}
        setValue={handleSearch}
        placeholder="Search Notes"
      /> */}

      <div className="flex items-center gap-2">
        <div className="border-2 border-black  text-black h-12 w-12 rounded-md flex items-center justify-center">
          <FaUser size={21} />
        </div>
        <div>
          <p className="font-semibold text-sm">
            {user?.username || "<username>"}
          </p>
          <button
            onClick={logoutUser}
            className="bg-slate-200 p-1 flex items-center justify-center rounded-md text-xs"
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
