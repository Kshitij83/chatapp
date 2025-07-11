import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(authUser.fullName);
  const [username, setUsername] = useState(authUser.username);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update name and username handler
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAuthUser({ ...authUser, fullName: data.fullName, username: data.username });
      localStorage.setItem(
        "chat-user",
        JSON.stringify({ ...authUser, fullName: data.fullName, username: data.username })
      );
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete account handler
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="profile-window rounded-2xl chat-window-bg shadow-2xl p-8 flex flex-col">
      {/* Header with Go Back Button and Profile Title */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-3 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors btn-animated"
            onClick={() => navigate("/")}
            style={{ color: '#EEEEEE', borderColor: '#00ADB5' }}
          >
            <FaArrowLeft size={18} />
            <span className="text-lg font-medium">Back to Chat</span>
          </button>
          <h1 className="text-4xl font-bold" style={{ color: '#EEEEEE' }}>
            My Profile
          </h1>
        </div>
      </div>

      {/* Profile Content - Wider Layout */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Profile Image Section */}
          <div className="flex justify-center">
            <img
              src={authUser.profilePic}
              alt="profile"
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-full shadow-lg"
              style={{ border: '4px solid #00ADB5' }}
            />
          </div>
          
          {/* Profile Information Section */}
          <div className="space-y-6">
            {editMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#00ADB5' }}>
                    Full Name:
                  </label>
                  <input
                    className="input w-full h-14 text-lg rounded-lg"
                    style={{ 
                      backgroundColor: '#393E46', 
                      borderColor: '#00ADB5', 
                      color: '#EEEEEE' 
                    }}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#00ADB5' }}>
                    Username:
                  </label>
                  <input
                    className="input w-full h-14 text-lg rounded-lg"
                    style={{ 
                      backgroundColor: '#393E46', 
                      borderColor: '#00ADB5', 
                      color: '#EEEEEE' 
                    }}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your username"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#393E46' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>Full Name</p>
                    <p className="text-2xl font-semibold" style={{ color: '#EEEEEE' }}>{authUser.fullName}</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#393E46' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>Username</p>
                    <p className="text-2xl font-semibold" style={{ color: '#EEEEEE' }}>@{authUser.username}</p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              {editMode ? (
                <>
                  <button 
                    className="btn border-none btn-animated flex-1 h-14 text-lg font-semibold rounded-lg"
                    style={{ backgroundColor: '#00ADB5', color: '#222831' }}
                    onClick={handleSave} 
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                  </button>
                  <button
                    className="btn border-none btn-animated flex-1 h-14 text-lg font-semibold rounded-lg"
                    style={{ backgroundColor: '#393E46', color: '#EEEEEE' }}
                    onClick={() => {
                      setEditMode(false);
                      setFullName(authUser.fullName);
                      setUsername(authUser.username);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn border-none btn-animated flex-1 h-14 text-lg font-semibold rounded-lg"
                    style={{ backgroundColor: '#00ADB5', color: '#222831' }}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
                    className="btn border-none btn-animated flex-1 h-14 text-lg font-semibold rounded-lg"
                    style={{ backgroundColor: '#dc2626', color: '#EEEEEE' }}
                    onClick={() => setShowModal(true)}
                  >
                    Delete Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center modal-overlay" 
             style={{ backgroundColor: 'rgba(34, 40, 49, 0.8)', zIndex: 100 }}>
          <div className="rounded-xl p-8 flex flex-col items-center max-w-md w-full mx-4" 
               style={{ backgroundColor: '#222831', border: '2px solid #00ADB5', zIndex: 101 }}>
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#EEEEEE' }}>Delete Account</h3>
            <p className="text-center mb-6" style={{ color: '#EEEEEE' }}>
              This action cannot be undone. All your messages and data will be permanently deleted.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                className="btn border-none btn-animated flex-1 font-semibold rounded-lg"
                style={{ backgroundColor: '#dc2626', color: '#EEEEEE' }}
                onClick={handleDelete} 
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
              </button>
              <button 
                className="btn border-none btn-animated flex-1 font-semibold rounded-lg"
                style={{ backgroundColor: '#393E46', color: '#EEEEEE' }}
                onClick={() => setShowModal(false)} 
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
