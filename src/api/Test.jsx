import api from "./api";
import { useEffect } from "react";

export default function Test() {

  useEffect(() => {
    api.get("/barang")
      .then(res => {
        console.log("DATA DARI BACKEND:", res.data);
      })
      .catch(err => {
        console.log("ERROR:", err);
      });
  }, []);

  return <h1>Cek Console Browser</h1>;
}
