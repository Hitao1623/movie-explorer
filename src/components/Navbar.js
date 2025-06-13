import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "10px" }}>
        Home
      </Link>
      <Link to="/favorites" style={{ marginRight: "10px" }}>
        Favorites
      </Link>
      <Link to="/register" style={{ marginRight: "10px" }}>
        Register
      </Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
