import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../src/utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUserInfo, setTargetUserInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const user = useSelector(store => store.user);
  const userId = user?._id;

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId || !targetUserId) {
      return;
    }
    
    const socket = createSocketConnection();
    socketRef.current =socket;
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
      photoUrl: user.photoUrl
    });
    
    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, {
        sender: data.userId === userId ? 'self' : 'other',
        text: data.text,
        name: data.firstName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        photoUrl: data.photoUrl
      }]);
    });
    
    // Handle receiving user info
    socket.on("userInfo", (data) => {
      if (data.userId === targetUserId) {
        setTargetUserInfo(data);
      }
    });
    
    return () => {
      socket.disconnect();
      console.log("🔌 Socket disconnected on cleanup");
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    //const socket = createSocketConnection();
    
    // Send message to server
    socketRef.current?.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
      photoUrl: user.photoUrl
    });
    
    // Clear input field
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getAvatarUrl = (message) => {
    if (message.sender === 'self') {
      return user.photoUrl || "/api/placeholder/40/40"; // Fallback to placeholder if no photo
    } else if (message.photoUrl) {
      return message.photoUrl;
    } else if (targetUserInfo?.photoUrl) {
      return targetUserInfo.photoUrl;
    } else {
      return "/api/placeholder/40/40"; // Default placeholder
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
    <div className="w-full max-w-3xl h-[90vh] bg-base-200 shadow-xl rounded-2xl overflow-hidden flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="bg-base-300 p-4 shadow-md">
        <h2 className="text-xl font-semibold">
          {targetUserInfo ? targetUserInfo.firstName : 'Chat'}
        </h2>
      </div>
  
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`chat ${message.sender === 'self' ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 transition-transform duration-300">
                  <img
                    alt="Chat avatar"
                    src={getAvatarUrl(message)}
                  />
                </div>
              </div>
              <div className="chat-header">
                {message.name}
                <time className="text-xs opacity-50 ml-2">{message.time}</time>
              </div>
              <div className="chat-bubble">{message.text}</div>
              <div className="chat-footer opacity-50">
                {message.sender === 'self' ? 'Delivered' : ''}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
  
      {/* Input */}
      <div className="p-4 bg-base-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="input input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary hover:scale-105 transition-transform duration-300"
          >
            Send
          </button>
        </div>
      </div>
  
    </div>
  </div>
  
  );
};

export default Chat;