import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { getGeminiResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', text: t('chat_intro') }]);
    }
  }, [t, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to Jido." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-white/20 animate-bounce-slow group"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
            <Bot className="text-white" size={24} />
            <h3 className="text-white font-bold">{t('chat_header')}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-sm text-slate-400">
                    Typing...
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder={t('chat_placeholder')} 
              className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200" 
            />
            <button 
              type="submit" 
              disabled={isLoading} 
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;