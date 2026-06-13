import axios from 'axios';

// Konfigurasi URL backend (FastAPI berjalan di port 8000)
const API_URL = 'http://localhost:8000';

export const predictStressLevel = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, data);
    return response.data;
  } catch (error) {
    console.error("Gagal memanggil API:", error);
    throw error;
  }
};