import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";
import "remixicon/fonts/remixicon.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email wajib diisi";
    if (!formData.password) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      Swal.fire({
        title: "Login berhasil!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  const handleDirectToWeb = () => {
    navigate("/Apo?kategori=Siswa");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">

      {/* LOGIN CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 
                 p-8 rounded-2xl w-full max-w-md animate__animated animate__fadeIn"
      >
        {/* SECRET BUTTON */}
        <button
          type="button"
          onClick={handleDirectToWeb}
          className="text-blue-900 mb-2 text-sm"
        >
        
        </button>

        {/* ICON + TITLE */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-3">
            <i className="ri-shield-user-line text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-blue-800">Login</h2>
          <p className="text-gray-700 mt-1">Silakan masuk untuk melanjutkan</p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded-lg px-3 py-2 bg-white/60 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded-lg px-3 py-2 bg-white/60 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* BUTTON LOGIN */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 
                     transition-all duration-200 shadow-md"
        >
          Login
        </button>

        {/* REGISTER LINK */}
        <div className="text-center mt-6">
          <p className="text-gray-800">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Daftar
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
