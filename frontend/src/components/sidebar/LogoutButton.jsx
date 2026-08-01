import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="icon-btn"
      title="Logout"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-ink-muted border-t-primary rounded-full animate-spin" />
      ) : (
        <BiLogOut size={18} />
      )}
    </button>
  );
};

export default LogoutButton;
