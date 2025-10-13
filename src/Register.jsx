import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

    const { name, email, password, confirm } = formData;
    let newErrors = {};

    if (name.trim().length < 2) newErrors.name = "Nama minimal 2 karakter.";
    if (!isValidEmail(email)) newErrors.email = "Masukkan email yang valid.";
    if (password.length < 1)
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
      name,
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

     
    setFormData({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 className="text-center font-bold text-1xl  mb-15">Buat akun baru</h1>

        <form onSubmit={handleSubmit}>
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="masukkan nama"
            style={styles.input}
          />
          {errors.name && <div style={styles.error}>{errors.name}</div>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ketuk untuk mengetik...."
            style={styles.input}
          />
          {errors.email && <div style={styles.error}>{errors.email}</div>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="masukkan password"
            style={styles.input}
          />
          {errors.password && <div style={styles.error}>{errors.password}</div>}

          <label>Konfirmasi Password</label>
          <input
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            placeholder="Ketik ulang password"
            style={styles.input}
          />
          {errors.confirm && <div style={styles.error}>{errors.confirm}</div>}

          <button type="submit" style={styles.button}>
            Daftar
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ ...styles.button, background: "red", marginTop: 10 }}
          >
            Kembali
          </button>
        </form>

        {message && <div style={styles.success}>{message}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f7fb",
  },
  card: {
    background: "#fff",
    padding: 22,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(2,6,23,.08)",
    width: 360,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 6,
    marginBottom: 10,
    border: "1px solid #e6e9ef",
    borderRadius: 8,
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 16,
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#b91c1c", fontSize: 12, marginBottom: 6 },
  success: { color: "#065f46", fontSize: 13, marginTop: 8 },
};

export default Register;
