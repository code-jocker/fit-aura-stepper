import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Send, AlertCircle, CheckCircle, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export default function Support() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [problemTypes] = useState([
    'Order Issue', 'Payment Problem', 'Delivery Delay', 'Product Quality', 'Return Request', 'Other'
  ]);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolution, setShowResolution] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const newSocket = io(SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to support chat server');
      });

      newSocket.on('receive_message', (message) => {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
        setTimeout(scrollToBottom, 100);
      });

      newSocket.on('update_conversations', () => {
        fetchConversations(token);
      });

      setSocket(newSocket);
      fetchConversations(token);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const fetchConversations = async (authToken) => {
    try {
      const res = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setConversations(res.data || []);
    } catch (err) {
      console.error('Fetch conversations error:', err);
    }
  };

  const fetchMessages = async (conversationId) => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/messages?conversation=${conversationId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const sortedMessages = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation || !socket) return;

    const tempId = Date.now().toString();

    const optimisticMessage = {
      _id: tempId,
      senderId: user,
      receiverId: activeConversation._id,
      content: inputMessage,
      createdAt: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      socket.emit('send_message', {
        receiverId: activeConversation._id,
        content: inputMessage,
        tempId
      });
      setInputMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resolveProblem = async () => {
    if (!selectedProblem || !resolutionNotes) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages/resolve`, {
        conversationId: activeConversation._id,
        problemType: selectedProblem,
        resolutionNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowResolution(false);
      setSelectedProblem('');
      setResolutionNotes('');
      alert('Problem resolved successfully!');
    } catch (err) {
      console.error('Resolve problem error:', err);
      alert('Failed to resolve problem');
    }
  };

  if (!user || user.role !== 'support') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You need support role to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Support Dashboard | MBABAZI CLOSET</title>
      </Helmet>

      <div className="flex h-screen">
        {/* Conversations Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="text-amber-500" />
              Support Chat
            </h1>
            <p className="text-gray-600 text-sm mt-1">Active conversations: {conversations.length}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => {
                  setActiveConversation(conv);
                  fetchMessages(conv._id);
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  activeConversation?._id === conv._id ? 'bg-amber-50 border-l-4 border-amber-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{conv.lastMessage?.senderId?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessage?.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">{activeConversation.lastMessage?.senderId?.name}</h2>
                  <p className="text-sm text-gray-600">{activeConversation.lastMessage?.senderId?.email}</p>
                </div>
                <button
                  onClick={() => setShowResolution(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Resolve Problem
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId._id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId._id === user.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId._id === user.id ? 'text-amber-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Select a conversation</h3>
                <p className="text-gray-500">Choose a customer to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Resolve Problem</h3>
              <button onClick={() => setShowResolution(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Problem Type</label>
                <select
                  value={selectedProblem}
                  onChange={(e) => setSelectedProblem(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select problem type</option>
                  {problemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how the problem was resolved..."
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                />
              </div>
              <button
                onClick={resolveProblem}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}