// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { fetchMedicines } from "../api";

interface Medicine {
  id: string;
  name: string;
  category: string;
}

export default function Products() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
    "Nephrology", "Neurology", "Oncology", "Ophthalmology", 
    "Orthopedics", "Pediatrics", "Psychiatry", "Pulmonology"
  ];

  useEffect(() => {
    async function loadMedicines() {
      try {
        setLoading(true);
        const data = await fetchMedicines(selectedSpecialty);
        setMedicines(data);
      } catch (err) {
        console.error("Error loading medicines:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMedicines();
  }, [selectedSpecialty]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Inventory (300+ Medications)</h1>
      
      {/* Specialty Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedSpecialty("")}
          className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap ${!selectedSpecialty ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All Specialties
        </button>
        {specialties.map((spec) => (
          <button 
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap ${selectedSpecialty === spec ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medicines.map((med) => (
            <div key={med.id} className="border p-4 rounded shadow bg-white">
              <h3 className="font-semibold text-lg text-gray-900">{med.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Category: {med.category}</p>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-3 inline-block font-mono">
                ID: {med.id}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}