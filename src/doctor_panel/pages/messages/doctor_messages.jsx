import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisHorizontalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const DoctorMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Sample chats data
  const chats = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      lastMessage: "Thank you for the prescription, doctor",
      time: "10:30 AM",
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'patient', text: "Hello Dr. Wilson, I have a question about my medication", time: "10:15 AM" },
        { id: 2, sender: 'doctor', text: "Of course, how can I help you?", time: "10:20 AM" },
        { id: 3, sender: 'patient', text: "Should I take it before or after meals?", time: "10:25 AM" },
        { id: 4, sender: 'doctor', text: "Please take it after meals with a full glass of water", time: "10:28 AM" },
        { id: 5, sender: 'patient', text: "Thank you for the prescription, doctor", time: "10:30 AM" }
      ]
    },
    {
      id: 2,
      patientName: "Michael Brown",
      lastMessage: "I'll see you at the appointment tomorrow",
      time: "9:45 AM",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'doctor', text: "Hello Michael, just following up on your test results", time: "9:30 AM" },
        { id: 2, sender: 'patient', text: "Yes, I got them. Everything looks good?", time: "9:35 AM" },
        { id: 3, sender: 'doctor', text: "Yes, but I'd like to discuss them in detail. Can you come in tomorrow?", time: "9:40 AM" },
        { id: 4, sender: 'patient', text: "I'll see you at the appointment tomorrow", time: "9:45 AM" }
      ]
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In a real app, you would send this to your backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DoctorLayout>
      <div className="h-[calc(100vh-2rem)] -mt-6 -mx-6 flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100vh-8rem)]">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-all ${
                  selectedChat?.id === chat.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {chat.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-gray-900 truncate">{chat.patientName}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {selectedChat.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedChat.patientName}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <VideoCameraIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.sender === 'doctor'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-900'
                  } rounded-2xl px-4 py-2 shadow-sm`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'doctor' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-100">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    rows="1"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all">
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-gray-900 font-medium">No chat selected</h3>
              <p className="mt-1 text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorMessages; 