import { useAuth } from "./components/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      {isLoggedIn && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}
