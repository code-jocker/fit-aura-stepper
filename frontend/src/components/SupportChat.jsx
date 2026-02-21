import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Extract base URL for socket connection (remove /api if present)
const SOCKET_URL = API_URL.replace('/api', '');

export default function SupportChat({ embedded = false }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const isOpenRef = useRef(isOpen);
  const navigate = useNavigate();

  useEffect(() => {
    isOpenRef.current = isOpen;
    
    // If chat is opened and we have unread messages, mark them as read
    if (isOpen && socket && user) {
       // We can't know which messages are unread easily here without iterating, 
       // but we can send a blanket mark_read for messages from admin
       socket.emit('mark_read', { senderId: 'admin', receiverId: user.id });
    }
  }, [isOpen, socket, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize socket and load messages
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Connect to Socket.io
      const newSocket = io(SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('receive_message', (message) => {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m._id === message._id)) return prev;
          
          // If chat is open and message is from admin, mark as read
          if (isOpenRef.current && (message.senderId._id === 'admin' || message.senderId.role === 'admin')) {
             newSocket.emit('mark_read', { senderId: 'admin', receiverId: parsedUser.id });
          }
          
          return [...prev, message];
        });
        setTimeout(scrollToBottom, 100);
      });
      
      newSocket.on('messages_read', () => {
         setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      });

      setSocket(newSocket);

      // Fetch message history
      fetchMessages(token);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const fetchMessages = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort by creation time ascending
      const sortedMessages = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!user) {
      // Prompt login
      if (window.confirm('You need to log in to chat with support. Go to login page?')) {
        navigate('/login');
      }
      return;
    }

    const tempId = Date.now();
    const content = inputMessage;
    setInputMessage(''); // Clear input immediately

    // Optimistic UI update
    /* 
    setMessages(prev => [...prev, {
      _id: tempId,
      senderId: { _id: user.id },
      content: content,
      createdAt: new Date().toISOString()
    }]);
    */

    if (socket) {
      socket.emit('send_message', {
        receiverId: 'admin',
        content: content,
        type: 'chat'
      });
    } else {
      // Fallback if socket fails
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/messages`, {
          receiverId: 'admin',
          content: content
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Fetch will happen automatically via socket or we can manually fetch
      } catch (err) {
        console.error('Send error:', err);
        alert('Failed to send message');
      }
    }
  };

  if (embedded) {
    return (
      <div className="bg-white rounded-[2rem] shadow-sm w-full h-[600px] flex flex-col border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">M</div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest">Support Chat</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                    {user ? 'Online' : 'Login Required'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-sm font-bold text-gray-500 mb-4">Please log in to chat with our support team.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                >
                  Log In Now
                </button>
              </div>
            ) : messages.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                <p className="font-bold uppercase tracking-widest mb-2">No messages yet</p>
                <p>Start a conversation with our support team!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId?._id === user.id || msg.senderId === user.id;
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-6 py-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-black text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                      <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          {user && (
            <div className="p-6 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 ring-amber-500 transition-all">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent px-4 py-2 text-sm font-bold outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all disabled:opacity-30 active:scale-95 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="bg-white rounded-[2rem] shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-500 flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">M</div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest">Support Chat</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                    {user ? 'Online' : 'Login Required'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">✕</button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-sm font-bold text-gray-500 mb-4">Please log in to chat with our support team.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                >
                  Log In Now
                </button>
              </div>
            ) : messages.length === 0 && !isLoading ? (
              <div className="text-center text-gray-400 text-xs mt-10">
                <p>No messages yet.</p>
                <p>Start a conversation with us!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId?._id === user.id || msg.senderId === user.id;
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-black text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          {user && (
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent px-3 py-2 text-xs font-bold outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all disabled:opacity-30 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
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