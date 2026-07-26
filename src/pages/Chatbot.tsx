// src/pages/Chatbot.tsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai/web';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  fileUrl?: string;
  fileName?: string;
}

export const Chatbot: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorId = searchParams.get('doctor') || 'cardio';

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello there. I'm here to support you through your health evaluation today. Feel free to share what's on your mind or attach any medical scans or reports so we can look at them together.` }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://medisync-design-production.up.railway.app';

  // Initialize Google Gen AI client for frontend casual chat
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() && !selectedFile) return;

    const userMsg = inputQuery.trim();
    const fileToUpload = selectedFile;
    
    setInputQuery('');
    setSelectedFile(null);

    const filePreviewUrl = fileToUpload && fileToUpload.type.startsWith('image/') 
      ? URL.createObjectURL(fileToUpload) 
      : undefined;

    setMessages((prev) => [
      ...prev, 
      { 
        role: 'user', 
        content: userMsg, 
        fileUrl: filePreviewUrl, 
        fileName: fileToUpload?.name 
      }
    ]);

    // Casual chat vs Backend evaluation condition
    const medicalKeywords = [
      'pain', 'ache', 'symptom', 'fever', 'cough', 'blood', 'pressure', 'sugar', 
      'report', 'scan', 'test', 'medicine', 'drug', 'doctor', 'disease', 'sick', 
      'hurt', 'headache', 'stomach', 'heart', 'chest', 'breath', 'fatigue', 'dizzy'
    ];
    
    const lowerMsg = userMsg.toLowerCase();
    const hasMedicalKeyword = medicalKeywords.some(keyword => lowerMsg.includes(keyword));
    const isCasualChat = !fileToUpload && !hasMedicalKeyword;

    setLoading(true);

    try {
      if (isCasualChat && aiClient) {
        try {
          // Use frontend Gemini SDK for casual chat (saves backend tokens!)
          const response = await aiClient.models.generateContent({
            model: 'models/gemini-1.5-flash',
            contents: userMsg,
            config: {
              systemInstruction: "You are a friendly medical assistant chatbot. Keep conversational replies warm, brief, and polite."
            }
          });

          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: response.text || "Hello! How can I help you today?" }
          ]);
          return;
        } catch (frontendErr) {
          console.warn("Frontend Gemini SDK call failed, falling back to backend...", frontendErr);
          // Fall through to backend if frontend key encounters any hiccup
        }
      }

      // Send to backend for document scans, serious clinical questions, or if frontend client is missing/failed
      const formData = new FormData();
      formData.append('message', userMsg || 'Please review this attached medical document.');
      if (fileToUpload) {
        formData.append('file', fileToUpload);
      }

      const chatRes = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        body: formData,
      });
      
      const chatData = await chatRes.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: chatData.reply || chatData.error || "I've reviewed the details. Let's take things step by step." }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I encountered a minor connection issue. Please check your API key settings or try again." }
      ]);
    } finally {
      setLoading(false);
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
        <h2 className="text-lg font-semibold capitalize">Live Telehealth Session — Specialist Consultation</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-500 px-2.5 py-1 rounded-full">Secure SSL Channel</span>
          {!sessionEnded && (
            <button 
              onClick={() => setSessionEnded(true)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border-x border-slate-200 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg rounded-xl px-4 py-3 text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-200'}`}>
              {msg.fileUrl && (
                <div className="mb-2">
                  <img src={msg.fileUrl} alt="Uploaded scan" className="max-h-48 rounded-lg object-contain bg-slate-900/10 w-full" />
                </div>
              )}
              {msg.fileName && !msg.fileUrl && (
                <div className="text-xs italic mb-1 opacity-90">📎 {msg.fileName}</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm animate-pulse">
              Dr. Persona is reviewing your records and reflecting...
            </div>
          </div>
        )}
      </div>

      {sessionEnded && (
        <div className="bg-amber-50 border-t border-amber-200 p-3 flex flex-wrap justify-between items-center px-6 gap-2">
          <p className="text-xs text-amber-800 font-medium">Session Ended. Official Prescription & Recommended Medications Ready.</p>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadPDF} className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
              Download PDF
            </button>
            <button onClick={() => navigate('/products')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
              🛒 Buy Medicines in Products
            </button>
          </div>
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
          placeholder="Talk to your doctor or type your symptoms..."
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          disabled={sessionEnded}
        />
        <button type="submit" disabled={sessionEnded} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;