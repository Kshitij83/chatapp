import React from "react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="mt-auto">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 cursor-pointer transition-colors"
          style={{ color: "#00ADB5" }}
          onClick={logout}
          onMouseEnter={(e) => {
            e.target.style.color = "#EEEEEE";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#00ADB5";
          }}
        />
      ) : (
        <span className="loading loading-spinner" style={{ color: "#00ADB5" }}></span>
      )}
    </div>
  );
};

export default LogoutButton;
