import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    CCard,
    CCardBody,
    CButton,
    CFormInput,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TabelLevel() {
    const [levels, setLevels] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const API = "http://localhost:5000/level";

    const fetchData = async () => {
        try {
            const res = await axios.get(API);
            setLevels(res.data);
        } catch (error) {
            console.log("Gagal mengambil data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLevel = levels.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus data?",
            text: "Data tidak dapat dikembalikan setelah dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${API}/${id}`);
                Swal.fire("Dihapus!", "Data telah dihapus.", "success");
                fetchData();
            }
        });
    };

    const handleEdit = (id) => {
        navigate(`/editlevel/${id}`); // arahkan ke page Edit
    };

    return (
        <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
            <h4 className="mb-4">⚙️ CRUD Level User</h4>

            {/* Search + Tambah Button */}
            <div className="d-flex gap-3 align-items-center mb-3">
                <CFormInput
                    placeholder="Cari Level..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "240px" }}
                />

                <CButton
                    color="primary"
                    onClick={() => navigate("/tambahkategoril")}
                >
                    Tambah Level
                </CButton>
            </div>

            {/* Table */}
            <CCard>
                <CCardBody>
                    <table className="table table-hover text-center">
                        <thead style={{ backgroundColor: "#E9F3FF" }}>
                            <tr>
                                <th>No</th>
                                <th>Nama Level</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLevel.length > 0 ? (
                                filteredLevel.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => navigate(`/editkategoril/${item.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-secondary py-3">
                                        Tidak ada data ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CCardBody>
            </CCard>
        </div>
    );
}
