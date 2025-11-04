import axios from "axios";

const API_URL = "http://localhost:5000"; // pastikan json-server jalan

// Tagihan
export const getTagihan = () => axios.get(`${API_URL}/tagihan`);
export const addTagihan = (data) => axios.post(`${API_URL}/tagihan`, data);
export const updateTagihan = (id, data) => axios.put(`${API_URL}/tagihan/${id}`, data);
export const deleteTagihan = (id) => axios.delete(`${API_URL}/tagihan/${id}`);

// Kategori
export const getKategori = () => axios.get(`${API_URL}/kategoriTagihan`);
export const addKategori = (data) => axios.post(`${API_URL}/kategoriTagihan`, data);
export const updateKategori = (id, data) => axios.put(`${API_URL}/kategoriTagihan/${id}`, data);
export const deleteKategori = (id) => axios.delete(`${API_URL}/kategoriTagihan/${id}`);

const fetchData = async () => {
  const resTagihan = await getTagihan();
  const resKategori = await getKategori();
  console.log("tagihan:", resTagihan.data);
  console.log("kategori:", resKategori.data);
  setTagihan(resTagihan.data);
  setKategori(resKategori.data);
};

