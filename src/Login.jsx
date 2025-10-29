import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";

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
      // Tampilkan SweetAlert sukses
      Swal.fire({
        title: "Login berhasil!",
        text: "Selamat datang di dashboard.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        position: "center",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      // Reset form
      setFormData({ email: "", password: "" });

      // Pindah halaman setelah 1.5 detik
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  const handleDirectToWeb = () => {
    navigate("/Apo?kategori=Siswa");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        {/* Tombol ke web Apo */}
        <button
          type="button"
          onClick={handleDirectToWeb}
          className="text-white py-2"
        >
          M
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {/* Username */}
         

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded px-3 py-2"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Tombol login dengan SweetAlert */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        {/* Link ke halaman register */}
        <div className="text-center mt-6">
          <p className="text-gray-700">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 underline hover:text-blue-800"
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
