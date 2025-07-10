import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";

const Home = () => {
  return (
    <div className="standard-window flex rounded-2xl overflow-hidden chat-window-bg shadow-2xl">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;
