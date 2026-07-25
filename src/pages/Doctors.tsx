// src/pages/Doctors.tsx
import React, { useEffect, useState } from "react";
import { fetchDoctors } from "../api";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fee: number;
  bio: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Error loading doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  if (loading) return <div className="p-6">Loading specialized doctors...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Specialized Doctors (12 Personas)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="border p-5 rounded-lg shadow bg-white">
            <h3 className="text-xl font-semibold text-blue-700">{doc.name}</h3>
            <p className="text-sm font-medium text-gray-700 mt-1">Specialty: {doc.specialty}</p>
            <p className="text-sm text-gray-600 mt-2">{doc.bio}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 font-bold">Fee: ${doc.fee}</span>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}