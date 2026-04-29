import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Send, User, CheckCircle, AlertCircle, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export default function SupportTeam() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [problemTypes] = useState([
    'Order Issue', 'Payment Problem', 'Delivery Delay', 'Product Quality', 'Return Request', 'Other'
  ]);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if user is support staff
      if (!['support', 'admin', 'staff'].includes(parsedUser.role)) {
        alert('Access denied. This page is for support staff only.');
        window.location.href = '/';
        return;
      }

      const newSocket = io(SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to support chat server');
      });

      newSocket.on('receive_message', (message) => {
        if (activeConversation && (
          message.senderId._id === activeConversation._id || 
          message.senderId === activeConversation._id
        )) {
          setMessages(prev => {
            if (prev.some(m => m._id === message._id)) return prev;
            return [...prev, message];
          });
          setTimeout(scrollToBottom, 100);
        }
        // Refresh conversations
        fetchConversations(token);
      });

      newSocket.on('update_conversations', () => {
        fetchConversations(token);
      });

      setSocket(newSocket);
      fetchConversations(token);

      return () => {
        newSocket.disconnect();
      };
    } else {
      window.location.href = '/login';
    }
  }, [activeConversation]);

  const fetchConversations = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data || []);
    } catch (err) {
      console.error('Fetch conversations error:', err);
    }
  };

  const fetchMessages = async (conversationId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/messages/user/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    const userId = conv.user?._id || conv._id;
    setActiveConversation(userId);
    fetchMessages(userId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation || !socket) return;

    const content = inputMessage;
    setInputMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages`, {
        receiverId: activeConversation,
        content: content,
        type: 'chat'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Optimistic update
      const optimisticMessage = {
        _id: Date.now(),
        content: content,
        senderId: user._id,
        receiverId: activeConversation,
        type: 'chat',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, optimisticMessage]);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleResolve = () => {
    setShowResolution(true);
  };

  const handleSaveResolution = () => {
    alert(`Issue resolved! Resolution notes: ${resolutionNotes}`);
    setShowResolution(false);
    setResolutionNotes('');
    setSelectedProblem('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Support Team - MBABAZI CLOSET</title>
      </Helmet>

      {/* Header */}
      <header className="bg-black text-white px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-wider">Support Team Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold">{user.name}</span>
            <span className="bg-amber-500 text-black text-xs px-2 py-1 rounded font-black uppercase">{user.role}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations List */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-black uppercase tracking-wider">Conversations</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                {conversations.length} active chats
              </p>
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-amber-50 transition-all ${
                      activeConversation === (conv.user?._id || conv._id) ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <User className="text-white" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm uppercase truncate">
                          {conv.user?.name || 'Customer'}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-400 font-bold uppercase text-xs">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <User className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase">
                        {conversations.find(c => (c.user?._id || c._id) === activeConversation)?.user?.name || 'Customer'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {conversations.find(c => (c.user?._id || c._id) === activeConversation)?.user?.email || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResolve}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Resolve Issue
                  </button>
                </div>

                {/* Problem Type Selection */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {problemTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedProblem(type)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                          selectedProblem === type
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => {
                    const senderId = msg.senderId?._id || msg.senderId;
                    const isSupport = senderId === user._id;
                    
                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                            isSupport
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm font-bold">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isSupport ? 'text-gray-400' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Resolution Modal */}
                {showResolution && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black uppercase">Resolve Issue</h3>
                        <button onClick={() => setShowResolution(false)}>
                          <X size={24} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Issue Type</label>
                          <p className="font-bold">{selectedProblem || 'General Inquiry'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Resolution Notes</label>
                          <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold"
                            rows="4"
                            placeholder="Describe how the issue was resolved..."
                          />
                        </div>
                        <button
                          onClick={handleSaveResolution}
                          className="w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-amber-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="bg-black text-white px-6 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-300">Select a conversation</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">
                  Choose a customer to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
