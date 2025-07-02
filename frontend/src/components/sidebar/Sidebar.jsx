import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      {/* Profile Button */}
      <button
        className="flex items-center gap-2 mb-4 p-2 rounded bg-slate-600 hover:bg-slate-700 text-white font-semibold"
        onClick={() => navigate("/profile")}
      >
        <img
          src={authUser.profilePic}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <span>Profile</span>
      </button>
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
