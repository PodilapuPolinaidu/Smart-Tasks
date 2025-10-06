import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:2000/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      Swal.fire({
        title: "Welcome Back! 🎉",
        text: "Login successful!",
        icon: "success",
        confirmButtonColor: "#6c63ff",
        confirmButtonText: "Start Managing Tasks",
      }).then((result) => {
        if (result.isConfirmed) {
          // localStorage.setItem("id", response.data.user.id);
          window.location.href = "/home";
        }
      });

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">To-Do List Login</h2>
        <p className="login-subtitle">Stay organized, stay productive ✨</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-login">
            <label>Email</label>
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group-login">
            <label>Password</label>
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                type="password"
                autoComplete="off"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button className="loginBtn" type="submit">
            <i className="bi bi-box-arrow-in-right"></i> Sign In
          </button>

          {error && <p className="error">{error}</p>}

          <p className="signup-text">
            Don’t have an account?{" "}
            <a href="/" className="signup-link">
              <i className="bi bi-person-plus"></i> Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
