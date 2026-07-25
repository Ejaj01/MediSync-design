import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fee: number;
  bio: string;
}

export const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiBaseUrl}/api/doctors`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch the 12 specialized doctor personas from backend.');
        }
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelectDoctor = (doctorId: string) => {
    navigate(`/chat?doctor=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-lg font-medium text-blue-600 animate-pulse">Loading 12 Specialized Medical Personas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Medisync Clinical Specialists</h1>
        <p className="text-slate-600 mt-2">Select from our 12 expert physician personas tailored for advanced diagnostics and consultation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                    {doctor.specialty}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">${doctor.fee}</span>
                  <p className="text-xs text-slate-500">Per session</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">{doctor.bio}</p>
            </div>
            <button
              onClick={() => handleSelectDoctor(doctor.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Consult {doctor.name.split(' ')[1] || doctor.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;