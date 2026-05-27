import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (location.state?.startChatWith) {
      const user = location.state.startChatWith;
      setActiveChat(user);
      fetchMessages(user._id);
      
      // Ensure this user is in the conversations list
      setConversations(prev => {
        if (!prev.find(c => c._id === user._id)) {
          return [user, ...prev];
        }
        return prev;
      });
    }
  }, [location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setConversations(res.data.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setMessages(res.data.data.messages);
        // Instantly notify Navbar to update unread message count
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSelectChat = (user) => {
    setActiveChat(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const payload = {
        receiverId: activeChat._id,
        content: newMessage
      };
      const res = await axios.post(`${API_URL}/api/v1/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status === 'success') {
        setMessages([...messages, res.data.data.message]);
        setNewMessage('');
        // Instantly notify Navbar to update unread message count
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex overflow-hidden">
        
        {/* Sidebar - Conversations List */}
        <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-6 border-b border-slate-200 bg-white">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FiMessageSquare /> Messages
            </h2>
          </div>
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="p-6 text-slate-400 text-center">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-slate-400 text-center text-sm">No conversations yet.</div>
            ) : (
              conversations.map(user => (
                <div 
                  key={user._id} 
                  onClick={() => handleSelectChat(user)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex items-center gap-3 hover:bg-slate-100 ${activeChat?._id === user._id ? 'bg-primary-50 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <FiUser className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{user.companyName || (user.userType === 'service_provider' ? 'Contractor' : 'Customer')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-2/3 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <FiUser />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{activeChat.name}</h3>
                  <span className="text-xs text-slate-500">{activeChat.companyName || (activeChat.userType === 'service_provider' ? 'Contractor' : 'Customer')}</span>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 my-auto text-sm">
                    Start the conversation. Ask for a quote or negotiate price.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender === currentUser._id;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FiMessageSquare className="text-4xl text-slate-300" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
