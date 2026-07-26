// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { fetchMedicines } from "../api";

interface Medicine {
  id: string;
  name: string;
  category: string;
  specialty?: string;
  price?: number; // fallback if fee/price isn't defined
}

interface PurchaseResult {
  token: string;
  transaction_id: string;
}

export default function Products() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  // Modal state
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);

  const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
    "Nephrology", "Neurology", "Oncology", "Ophthalmology", "Orthopedics", "Pediatrics"
  ];

  useEffect(() => {
    loadMeds(selectedSpecialty);
  }, [selectedSpecialty]);

  async function loadMeds(specialty?: string) {
    setLoading(true);
    try {
      const data = await fetchMedicines(specialty);
      setMedicines(data);
    } catch (err) {
      console.error("Error loading medicines:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCheckout = (med: Medicine) => {
    setSelectedMed(med);
    setPurchaseResult(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedMed) return;
    setProcessing(true);
    try {
      // Simulating purchase API request using checkout endpoint structure
      const price = selectedMed.price || 15; // default price if not specified
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/api/checkout?doctor_id=${selectedMed.id}&amount=${price}`, {
        method: "POST",
      });
      const data = await response.json();
      setPurchaseResult({
        token: data.token || `MED-PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        transaction_id: data.transaction_id || `txn_med_${Math.random().toString(36).substring(2, 10)}`
      });
    } catch (err) {
      console.error("Purchase failed:", err);
      alert("Failed to process medicine purchase. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!selectedMed || !purchaseResult) return;
    const price = selectedMed.price || 15;
    
    const receiptContent = `
========================================
         MEDISYNC PHARMACY RECEIPT
========================================
Medicine: ${selectedMed.name}
Category: ${selectedMed.category}
Amount Paid: $${price}
Token Pass: ${purchaseResult.token}
Transaction ID: ${purchaseResult.transaction_id}
Date: ${new Date().toLocaleString()}
========================================
Thank you for purchasing with MediSync!
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MediSync_Pharmacy_Receipt_${purchaseResult.token}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setSelectedMed(null);
    setPurchaseResult(null);
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Inventory (300+ Medications)</h1>

      {/* Specialty Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setSelectedSpecialty("")}
          className={`px-3 py-1.5 rounded text-sm font-medium ${selectedSpecialty === "" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          All Specialties
        </button>
        {specialties.map((spec) => (
          <button 
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3 py-1.5 rounded text-sm font-medium ${selectedSpecialty === spec ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-10 text-gray-600">Loading medicines inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {medicines.map((med) => (
            <div key={med.id} className="border p-4 rounded-lg shadow bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-700">{med.name}</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Category: {med.category}</p>
                <p className="text-xs text-gray-400 mt-2">ID: {med.id}</p>
              </div>
              <div className="mt-4 flex justify-between items-center pt-3 border-t">
                <span className="text-green-600 font-bold text-sm">$15.00</span>
                <button 
                  onClick={() => handleOpenCheckout(med)}
                  className="bg-blue-600 text-white px-2.5 py-1.5 rounded text-xs hover:bg-blue-700 transition"
                >
                  Buy Medicine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Gateway Modal */}
      {selectedMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Secure Pharmacy Checkout</h2>
            
            {!purchaseResult ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2 border">
                  <p className="text-sm text-gray-600"><strong>Medication:</strong> {selectedMed.name}</p>
                  <p className="text-sm text-gray-600"><strong>Category:</strong> {selectedMed.category}</p>
                  <p className="text-sm text-gray-600"><strong>Price:</strong> <span className="text-green-600 font-bold">$15.00</span></p>
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
                    {processing ? "Processing..." : "Pay $15.00"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-5xl mb-2">✓</div>
                <h3 className="text-lg font-bold text-gray-800">Purchase Successful!</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-left space-y-1">
                  <p className="text-xs text-gray-600"><strong>Medicine:</strong> {selectedMed.name}</p>
                  <p className="text-xs text-gray-600"><strong>Amount Paid:</strong> $15.00</p>
                  <p className="text-xs text-gray-600"><strong>Token Pass:</strong> <span className="font-mono text-blue-600">{purchaseResult.token}</span></p>
                  <p className="text-xs text-gray-600"><strong>Transaction ID:</strong> <span className="font-mono text-gray-600">{purchaseResult.transaction_id}</span></p>
                </div>
                <p className="text-xs text-gray-500">Your medication order has been processed. Download your receipt below.</p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDownloadReceipt}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition font-medium"
                  >
                    Download Receipt
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