// src/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchDoctors() {
  const response = await fetch(`${API_BASE_URL}/api/doctors`);
  return response.json();
}