import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: '👋 Welcome! I am your Fit Aura AI assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/chatbot/chat`, {
        message: currentInput
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'support',
        text: response.data.response
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'support',
        text: 'Sorry, I am having trouble connecting right now. Please try again later or contact us directly. 📧'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="bg-white rounded-[2rem] shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-black text-white p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">✨</div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest">Fit Aura AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Online Support</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">✕</button>
          </div>
          
          <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-black text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <input
                type="text"
                placeholder="Type your question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent px-3 py-2 text-xs font-bold outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all disabled:opacity-30 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
            <p className="text-[8px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">Powered by Fit Aura AI</p>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all transform hover:scale-110 active:scale-90 ${
          isOpen ? 'bg-amber-500 text-black rotate-90' : 'bg-black text-white'
        }`}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
