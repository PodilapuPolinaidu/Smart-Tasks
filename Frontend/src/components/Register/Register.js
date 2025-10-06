import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  const namePattern = /^[A-Za-z ]+$/;
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  function validate() {
    const newErrors = {};
    if (!namePattern.test(formData.name)) newErrors.name = "Invalid name";
    if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email";
    if (!passwordPattern.test(formData.password))
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & symbol";
    if (!formData.image) newErrors.image = "Upload an image";
    else if (!["image/jpeg", "image/png"].includes(formData.image.type))
      newErrors.image = "Only JPG or PNG allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("image", formData.image);
      sendForm(data);
      setFormData({ name: "", email: "", password: "", image: null });
      setErrors({});
    }
  }

  async function sendForm(obj) {
    try {
      await axios.post("http://localhost:2000/api/users/register", obj);
      Swal.fire({
        title: "Success",
        text: "Account created successfully 🎉",
        icon: "success",
        confirmButtonColor: "#6c63ff",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
    } catch (err) {
      Swal.fire({
        title: "Failed!",
        text: "User already exists. Please login.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      console.log("Error occured due to", err);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <form onSubmit={handleSubmit}>
          <h2 className="title">Create Account</h2>

          <div className="input-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
              />
            </div>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                type="password"
                autoComplete="off"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter strong password"
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label>Profile Image</label>
            <div className="file-input-wrapper">
              <i className="bi bi-image"></i>
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="image"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </div>
            {errors.image && <p className="error">{errors.image}</p>}
          </div>

          <p className="login-text">
            Already have an account?
            <a href="/login" className="login-link">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </a>
          </p>

          <button className="registerBtn" type="submit">
            <i className="bi bi-person-plus"></i> Register
          </button>
        </form>
      </div>
    </div>
  );
}
