import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleProfileButtonMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#1a1f25"; // Darker shade for hover
  };

  const handleProfileButtonMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#222831";
  };

  return (
    <div
      className="p-4 flex flex-col w-64 lg:w-72 xl:w-80"
      style={{
        borderRight: "2px solid #00ADB5",
        backgroundColor: "#393E46",
      }}
    >
      {/* Profile Button */}
      <button
        className="flex items-center gap-3 mb-6 p-4 rounded-lg font-semibold transition-colors btn-animated"
        style={{
          backgroundColor: "#222831",
          color: "#EEEEEE",
          border: "4px solid #00ADB5",
        }}
        onClick={() => navigate("/profile")}
        onMouseEnter={handleProfileButtonMouseEnter}
        onMouseLeave={handleProfileButtonMouseLeave}
      >
        <img
          src={authUser.profilePic}
          alt="profile"
          className="w-10 h-10 rounded-full"
          style={{ border: "3px solid #00ADB5" }}
        />
        <span style={{ color: "#00ADB5" }}>Profile</span>
      </button>
      <SearchInput />
      <div
        className="divider px-3"
        style={{ borderColor: "#00ADB5" }}
      ></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
