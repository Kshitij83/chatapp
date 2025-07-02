import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
    <div className="flex items-center justify-center min-h-[300px] min-w-[350px] md:min-h-[300px] rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
      <div className="bg-slate-700 rounded-lg p-8 flex flex-col items-center gap-4 w-full max-w-md">
        <img
          src={authUser.profilePic}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-slate-500 mx-auto"
        />
        <div className="w-full flex flex-col gap-2">
          {editMode ? (
            <>
              <label className="text-gray-300 text-sm">Name :</label>
              <input
                className="input input-bordered w-full text-center"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={loading}
              />
              <label className="text-gray-300 text-sm mt-2">Username :</label>
              <input
                className="input input-bordered w-full text-center"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <p className="text-white text-lg font-semibold">
                Name : <span className="font-normal">{authUser.fullName}</span>
              </p>
              <p className="text-gray-300 text-base">
                Username : <span className="font-normal">{authUser.username}</span>
              </p>
            </>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
              <button
                className="btn btn-ghost"
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
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
          <button className="btn btn-error ml-2" onClick={() => setShowModal(true)}>
            Delete Account
          </button>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold">Are you sure you want to delete your account?</p>
            <div className="flex gap-4">
              <button className="btn btn-error" onClick={handleDelete} disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={loading}>
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
