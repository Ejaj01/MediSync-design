// src/pages/Doctors.tsx
import React, { useEffect, useState } from "react";
import { fetchDoctors, bookConsultation } from "../api";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fee: number;
  bio: string;
}

interface BookingResult {
  token: string;
  transaction_id: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

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

  const handleOpenCheckout = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setBookingResult(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedDoctor) return;
    setProcessing(true);
    try {
      const response = await bookConsultation(selectedDoctor.id, selectedDoctor.fee);
      setBookingResult({
        token: response.token,
        transaction_id: response.transaction_id
      });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to process consultation payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setBookingResult(null);
  };

  if (loading) return <div className="p-6">Loading specialized doctors...</div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Our Specialized Doctors (12 Personas)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="border p-5 rounded-lg shadow bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-blue-700">{doc.name}</h3>
              <p className="text-sm font-medium text-gray-700 mt-1">Specialty: {doc.specialty}</p>
              <p className="text-sm text-gray-600 mt-2">{doc.bio}</p>
            </div>
            <div className="mt-4 flex justify-between items-center pt-3 border-t">
              <span className="text-green-600 font-bold">Fee: ${doc.fee}</span>
              <button 
                onClick={() => handleOpenCheckout(doc)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition"
              >
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Gateway Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Secure Consultation Checkout</h2>
            
            {!bookingResult ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2 border">
                  <p className="text-sm text-gray-600"><strong>Doctor:</strong> {selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600"><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-600"><strong>Consultation Fee:</strong> <span className="text-green-600 font-bold">${selectedDoctor.fee}</span></p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Simulated Card Details</label>
                  <input 
                    type="text" 
                    disabled 
                    value="4242 •••• •••• 4242 (Sandbox Mode)" 
                    className="w-full border rounded p-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition flex items-center"
                  >
                    {processing ? "Processing..." : `Pay $${selectedDoctor.fee}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-5xl mb-2">✓</div>
                <h3 className="text-lg font-bold text-gray-800">Payment Successful!</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-left space-y-1">
                  <p className="text-xs text-gray-600"><strong>Doctor:</strong> {selectedDoctor.name}</p>
                  <p className="text-xs text-gray-600"><strong>Fee Paid:</strong> ${selectedDoctor.fee}</p>
                  <p className="text-xs text-gray-600"><strong>Token Pass:</strong> <span className="font-mono text-blue-600">{bookingResult.token}</span></p>
                  <p className="text-xs text-gray-600"><strong>Transaction ID:</strong> <span className="font-mono text-gray-600">{bookingResult.transaction_id}</span></p>
                </div>
                <p className="text-xs text-gray-500">Your appointment has been registered successfully. Save your token for verification.</p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition font-medium"
                  >
                    Download Receipt (PDF)
                  </button>
                  <button 
                    onClick={closeModal}
                    className="flex-1 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}