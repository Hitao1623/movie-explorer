import { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js"; 

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const hashedPassword = CryptoJS.SHA256("password").toString();


  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.username === username)) {
      throw new Error("Username already exists");
    }
    users.push({ username, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Hash the input password for comparison
    const hashedInputPassword = CryptoJS.SHA1256(password).toString();

    //Find user by username and compare hashed passwords
    const foundUser = users.find(
      (u) => u.username === username && u.password === hashedInputPassword
    );
    
    if (!foundUser) throw new Error("Invalid username or password");

    // Store user data (without password) in localStorage
    const { password: _, ...userData } = foundUser;   // Remove password from stored user object
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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