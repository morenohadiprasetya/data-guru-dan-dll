import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "remixicon/fonts/remixicon.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const { email, password, confirm } = formData;
    let newErrors = {};

    if (!isValidEmail(email)) newErrors.email = "Masukkan email yang valid.";
    if (password.length < 6)
      newErrors.password = "Password minimal 6 karakter.";
    if (password !== confirm) newErrors.confirm = "Password tidak cocok.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const usersKey = "simple_register_users_v1";
    const raw = localStorage.getItem(usersKey);
    const users = raw ? JSON.parse(raw) : [];

    if (users.some((u) => u.email === email)) {
      setErrors({ email: "Email sudah terdaftar." });
      return;
    }

    const hashed = await hashPassword(password);
    const newUser = {
      id: Date.now(),
      email,
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));

    await Swal.fire({
      icon: "success",
      title: "Berhasil daftar!",
      text: "Akun kamu berhasil dibuat.",
      confirmButtonText: "Lanjut ke Login",
    });

    navigate("/");
    setFormData({ email: "", password: "", confirm: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 px-4">
      
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8 rounded-2xl w-full max-w-sm">

        {/* ICON HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3">
            <i className="ri-user-add-line text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800">Register</h1>
          <p className="text-gray-700 mt-1">Buat akun baru untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="font-medium text-gray-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white/60 
                         focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-medium text-gray-900">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Buat password"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white/60 
                         focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="font-medium text-gray-900">Konfirmasi Password</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Ketik ulang password"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white/60 
                         focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            {errors.confirm && (
              <p className="text-red-600 text-sm">{errors.confirm}</p>
            )}
          </div>

          {/* BUTTON REGISTER */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl shadow-md 
                       hover:bg-blue-800 transition"
          >
            Daftar
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-gray-800 text-sm mt-4">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </form>

        {message && <p className="text-green-700 text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
