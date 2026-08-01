import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-full flex rounded-2xl overflow-hidden card-glass">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <MessageContainer setShowSidebar={setShowSidebar} />
    </div>
  );
};

export default Home;
