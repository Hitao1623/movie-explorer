import { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js"; 

  
const API_URL = "http://localhost:3001";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  const register = async (username, email, password) => {

    // check if username already exists
    const res = await fetch(`${API_URL}/users?username=${username}`);
    const existingUser = await res.json();

    if (existingUser.length > 0) {
      throw new Error("Username already exists");
    }

    // Hash the password before storing
    const hashedPassword = hashPassword(password);

    // create new user
    const newUser = { username, email, password: hashedPassword };
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
  };

  const login = async (username, password) => {
    // 1. Fetch user by username
    const res = await fetch(`${API_URL}/users?username=${username}`);
    const users = await res.json();

    if (users.length === 0) {
      throw new Error("User not found");
    }

    // 2. Hash input password and compare locally
    const hashedAttempt = hashPassword(password);
    const user = users[0];

    if (user.password !== hashedAttempt) {
      throw new Error("Invalid password");
    }

    // 3. Store user session (without password)
    const { password: _, ...userData } = user; // Remove password
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}