import axios from 'axios';

// Konfigurasi URL backend (FastAPI berjalan di port 8000)
const API_URL = 'https://516b-2001-448a-8072-4a7c-c1b0-e3b7-c293-9e4c.ngrok-free.app';

export const predictStressLevel = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, data);
    return response.data;
  } catch (error) {
    console.error("Gagal memanggil API:", error);
    throw error;
  }
};