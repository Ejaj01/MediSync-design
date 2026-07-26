// src/pages/Chatbot.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chatbot: React.FC = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor') || 'cardio';

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I am your assigned Medisync specialist. How can I assist you with your clinical evaluation today? You may also attach any prior reports or medical scans using the upload option below.` }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://medisync-design-production.up.railway.app';

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() && !selectedFile) return;

    const userMsg = inputQuery;
    setInputQuery('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg || '[Attached Medical Document for Review]' }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMsg || 'Please review this medical scan/document.');
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const chatRes = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        body: formData,
      });
      
      const chatData = await chatRes.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: chatData.reply || 'Review completed. Follow recommended protocols.' }
      ]);

      if (chatData.prescription) {
        setPrescriptionData(chatData.prescription);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error communicating with the clinical server.' }
      ]);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/prescription/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, diagnosis: messages[messages.length - 1]?.content })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Medisync_Prescription_${doctorId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download official prescription PDF.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[85vh]">
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center shadow">
        <h2 className="text-lg font-semibold capitalize">Live Telehealth Session — Dr. Persona [{doctorId}]</h2>
        <span className="text-xs bg-blue-500 px-2.5 py-1 rounded-full">Secure SSL Channel</span>
      </div>

      <div className="flex-1 bg-slate-50 border-x border-slate-200 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg rounded-xl px-4 py-3 text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm animate-pulse">
              Physician analyzing query and attached records...
            </div>
          </div>
        )}
      </div>

      {prescriptionData && (
        <div className="bg-amber-50 border-t border-amber-200 p-3 flex justify-between items-center px-6">
          <p className="text-xs text-amber-800 font-medium">Official Prescription Ready for Download</p>
          <button onClick={handleDownloadPDF} className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
            Download Prescription PDF
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="bg-white border border-slate-200 rounded-b-xl p-3 flex items-center gap-3 shadow">
        <label className="cursor-pointer text-slate-500 hover:text-blue-600 transition-colors p-2" title="Attach Scan or Prescription">
          📎
          <input type="file" className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
        </label>
        {selectedFile && <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded truncate max-w-[120px]">{selectedFile.name}</span>}
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Type your symptoms or message..."
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;