// src/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Fetch the 12 Specialized Doctor Personas
export async function fetchDoctors() {
    const response = await fetch(`${API_BASE_URL}/api/doctors`);
    if (!response.ok) {
        throw new Error("Failed to fetch doctor personas");
    }
    return await response.json();
}

// Fetch the 300+ Medicines inventory (with optional specialty filter)
export async function fetchMedicines(specialty?: string) {
    let url = `${API_BASE_URL}/api/medicines`;
    if (specialty) {
        url += `?specialty=${encodeURIComponent(specialty)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch medicines inventory");
    }
    const data = await response.json();
    return data.medicines; // Returns the array of medicines
}