import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Username: "",
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

    const { Username, email, password, confirm } = formData;
    let newErrors = {};

    if (Username.trim().length < 3)
      newErrors.Username = "Username minimal 3 karakter.";
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
      Username,
      email,
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));

    Swal.fire({
      icon: "success",
      title: "Berhasil daftar!",
      text: "Akun kamu berhasil dibuat.",
      confirmButtonText: "Lanjut",
    }).then(() => {
      navigate("/");
    });

    setFormData({ Username: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center font-bold text-2xl mb-6 text-gray-800">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username di atas */}
          <div>
            <label className="font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              placeholder="Buat username"
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.Username && (
              <p className="text-red-600 text-sm mt-1">{errors.Username}</p>
            )}
          </div>

          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Buat password"
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="font-medium text-gray-700">Konfirmasi Password</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Ketik ulang password"
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.confirm && (
              <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Daftar
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-700 text-sm">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Login
              </button>
            </p>
          </div>
        </form>

        {message && <p className="text-green-700 text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
