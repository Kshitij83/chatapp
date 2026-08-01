import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserEdit, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(authUser.fullName);
  const [username, setUsername] = useState(authUser.username);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setAuthUser({
        ...authUser,
        fullName: data.fullName,
        username: data.username,
      });
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
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-3xl card-glass p-6 sm:p-10 flex flex-col animate-fade-up max-h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/")} className="theme-btn" title="Back to chat">
            <FaArrowLeft size={16} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">My Profile</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <img
              src={authUser.profilePic}
              alt="profile"
              className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover ring-4 ring-primary shadow-xl"
            />
            <span className="text-sm text-ink-muted">@{authUser.username}</span>
          </div>

          {/* Info */}
          <div className="flex-1 w-full space-y-5">
            {editMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-ink-muted">
                    Full Name
                  </label>
                  <input
                    className="input-modern w-full"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-ink-muted">
                    Username
                  </label>
                  <input
                    className="input-modern w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your username"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-surface-2 border border-[var(--border)] p-5">
                  <p className="text-xs uppercase tracking-wide font-semibold text-ink-muted mb-1">
                    Full Name
                  </p>
                  <p className="text-xl font-semibold text-ink">{authUser.fullName}</p>
                </div>
                <div className="rounded-xl bg-surface-2 border border-[var(--border)] p-5">
                  <p className="text-xs uppercase tracking-wide font-semibold text-ink-muted mb-1">
                    Username
                  </p>
                  <p className="text-xl font-semibold text-ink">@{authUser.username}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {editMode ? (
                <>
                  <button
                    className="btn-primary flex-1 min-w-[8rem]"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    className="btn-ghost flex-1 min-w-[8rem]"
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
                  <button className="btn-primary flex-1 min-w-[8rem]" onClick={() => setEditMode(true)}>
                    <FaUserEdit size={16} />
                    Edit Profile
                  </button>
                  <button className="btn-danger flex-1 min-w-[8rem]" onClick={() => setShowModal(true)}>
                    <FaTrashAlt size={15} />
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
        <div
          className="fixed inset-0 flex items-center justify-center modal-overlay bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 100 }}
        >
          <div className="rounded-2xl p-8 flex flex-col items-center max-w-md w-full mx-4 card-glass animate-fade-up">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-ink mb-2">Delete Account</h3>
            <p className="text-center text-ink-muted mb-6">
              This action cannot be undone. All your messages and data will be
              permanently deleted.
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="btn-danger flex-1"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                className="btn-ghost flex-1"
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
