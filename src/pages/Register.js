import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRightCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "../styles/pages/AuthForms.css";

export default function Register() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!formData.email.includes("@")) {
        return setError("Please enter a valid email.");
        }

        if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match.");
        }
        
        setLoading(true);
        try {
        await register(formData.username, formData.email, formData.password);
        navigate("/Login");
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };
    
    return (
        <div className="Auth-container">       
            <div className="Auth-card">
                <div className="Auth-header">
                    <h1>Create Account</h1>
                    <p>Join our community today</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FiUser className="input-icon" />
                        <input
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="formButton" type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                        <FiArrowRightCircle className="button-icon" />
                    </button>
                </form>

                <div className="social-login">
                    <p className="divider">Or register with</p>
                    <div className="social-buttons">
                        <button type="button" className="google-btn">
                            <FcGoogle className="social-icon" /> Google
                        </button>
                        <button type="button" className="facebook-btn">
                            <FaFacebook className="social-icon" /> Facebook
                        </button>
                    </div>
                </div>

                <div className="Auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}