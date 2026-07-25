import React, { useState } from 'react';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

const SAMPLE_MEDICINES: Medicine[] = [
  { id: 'med-1', name: 'Amoxicillin 500mg', category: 'Antibiotic', $1: 15, price: 15, description: 'Broad-spectrum bacterial infection treatment.' },
  { id: 'med-2', name: 'Lisinopril 10mg', category: 'Cardiovascular', $2: 20, price: 20, description: 'ACE inhibitor used for blood pressure regulation.' },
  { id: 'med-3', name: 'Metformin 850mg', category: 'Endocrine', $3: 12, price: 12, description: 'First-line medication for type 2 diabetes management.' },
  { id: 'med-4', name: 'Omeprazole 20mg', category: 'Gastrointestinal', $4: 18, price: 18, description: 'Proton pump inhibitor for acid reflux and ulcers.' },
];

export const Products: React.FC = () => {
  const [cart, setCart] = useState<Medicine[]>([]);
  const [purchased, setPurchased] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const addToCart = (med: Medicine) => {
    setCart((prev) => [...prev, med]);
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: 'pharmacy', amount: cart.reduce((acc, item) => acc + item.price, 0) })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPurchased(true);
      }
    } catch (err) {
      alert('Checkout simulation failed.');
    }
  };

  const handleDownloadReceipt = () => {
    alert('Simulated Pharmacy Retail Receipt Downloaded Successfully.');
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">MediSync Pharmacy Corner</h1>
        <p className="text-slate-600 mt-2">Order prescribed pharmaceutical items safely with integrated digital verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_MEDICINES.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">{med.category}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2">{med.name}</h3>
                <p className="text-slate-600 text-xs mt-1 mb-4">{med.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-slate-900">${med.price}</span>
                <button
                  onClick={() => addToCart(med)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Cart Summary</h2>
          {cart.length === 0 ? (
            <p className="text-slate-500 text-sm">Your cart is currently empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-slate-700 border-b border-slate-100 pb-2">
                  <span>{item.name}</span>
                  <span className="font-medium">${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-900 pt-2">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
              {!purchased ? (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm mt-4 transition-colors"
                >
                  Proceed to Secure Checkout
                </button>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-emerald-600 font-semibold text-center">Payment Verified Successfully!</p>
                  <button
                    onClick={handleDownloadReceipt}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg text-xs transition-colors"
                  >
                    Download Retail Receipt PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;