import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!email.includes("@")) {
        return setError("Please enter a valid email.");
        }

        if (password !== confirmPassword) {
        return setError("Passwords do not match.");
        }

        if (password.length < 6) {
        return setError("Password must be at least 6 characters.");
        }
        
        try {
        register(username, password);
        navigate("/Login");
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <br />

            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <br />

            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <br />

            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </label>
            <br />

            <button type="submit">Register</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
  );
}