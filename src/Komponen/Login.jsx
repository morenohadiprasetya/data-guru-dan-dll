import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api";
import "sweetalert2/dist/sweetalert2.min.css";
import "remixicon/fonts/remixicon.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔹 TAMBAHAN (tidak mengubah logic lama)
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("user", JSON.stringify(res.data));

      Swal.fire("Login berhasil", `Welcome ${res.data.email}`, "success");
      navigate("/dashboard");
    } catch (err) {
      Swal.fire(
        "Login gagal",
        err.response?.data?.message || "Server error",
        "error"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 px-4">
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8 rounded-2xl w-full max-w-sm">
        
        {/* ICON HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3">
            <i className="ri-login-box-line text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800">Login</h1>
          <p className="text-gray-700 mt-1">Masuk ke akun kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="font-medium text-gray-900">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white/60
                         focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              required
            />
          </div>

          {/* PASSWORD + ICON MATA */}
          <div className="relative">
            <label className="font-medium text-gray-900">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full mt-1 p-3 pr-12 rounded-xl border border-gray-300 bg-white/60
                         focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              required
            />

            {/* ICON EYE */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-11 text-gray-600 hover:text-blue-700"
            >
              <i
                className={
                  showPassword
                    ? "ri-eye-off-line text-xl"
                    : "ri-eye-line text-xl"
                }
              ></i>
            </button>
          </div>

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded shadow-md
                       hover:bg-blue-800 transition"
          >
            Login
          </button>

          {/* REGISTER LINK */}
          <p className="text-center text-gray-800 text-sm mt-4">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
