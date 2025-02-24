import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { collection, query, where, orderBy, addDoc, onSnapshot, serverTimestamp, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

const DoctorMessages = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(location.state?.selectedPatient || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messageSubscriptionRef = useRef(null);

  // Fetch patients list
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const patientIds = new Set();
        querySnapshot.docs.forEach(doc => {
          patientIds.add(doc.data().userId);
        });

        const patientsData = [];
        for (const patientId of patientIds) {
          const patientDoc = await getDoc(doc(db, 'users', patientId));
          if (patientDoc.exists()) {
            patientsData.push({
              id: patientId,
              ...patientDoc.data()
            });
          }
        }

        setPatients(patientsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user]);

  // Subscribe to messages
  useEffect(() => {
    if (!selectedPatient || !user) {
      setMessages([]);
      return;
    }

    setLoading(true); // Add loading state while fetching messages
    // Fix chatRoomId generation to match Firebase format
    const chatRoomId = `${user.uid}_${selectedPatient.id}`;
    console.log('Generated chatRoomId:', chatRoomId); // Debug log
    
    const messagesRef = collection(db, 'messages');
    
    // Create query for all messages in this chat room
    const q = query(
      messagesRef,
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    // Clean up previous subscription if exists
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current();
    }

    // Initial fetch of messages
    const fetchInitialMessages = async () => {
      try {
        console.log('Fetching messages for chat room:', chatRoomId); // Debug log
        const querySnapshot = await getDocs(q);
        console.log('Found messages:', querySnapshot.size); // Debug log
        
        if (!querySnapshot.empty) {
          const initialMessages = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date()
            };
          });
          console.log('Processed messages:', initialMessages.length); // Debug log
          setMessages(initialMessages);
        } else {
          console.log('No messages found for this chat room'); // Debug log
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial messages
    fetchInitialMessages();

    // Set up real-time listener for new messages
    messageSubscriptionRef.current = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setMessages(newMessages);
      setLoading(false);
    }, (error) => {
      console.error('Error in message subscription:', error);
      setLoading(false);
    });

    return () => {
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current();
      }
    };
  }, [selectedPatient, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedPatient) return;

    try {
      // Fix chatRoomId generation to match Firebase format
      const chatRoomId = `${user.uid}_${selectedPatient.id}`;
      const now = new Date();
      
      // Create message data with proper timestamp
      const messageData = {
        chatRoomId,
        senderId: user.uid,
        receiverId: selectedPatient.id,
        text: messageInput.trim(),
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        senderName: user.displayName || 'Doctor',
        receiverName: selectedPatient.displayName || 'Patient'
      };

      // Clear input immediately
      setMessageInput('');

      // Add optimistic message to UI
      const optimisticMessage = {
        id: 'temp-' + now.getTime(),
        ...messageData,
        timestamp: now,
        createdAt: now
      };

      // Log the message data for debugging
      console.log('Sending message with data:', {
        chatRoomId,
        senderId: user.uid,
        receiverId: selectedPatient.id
      });

      // Update messages immediately with optimistic update
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);

      // Ensure scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Send to Firebase with proper error handling
      try {
        const docRef = await addDoc(collection(db, 'messages'), messageData);
        console.log('Message saved successfully with ID:', docRef.id);
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        setMessages(prevMessages => 
          prevMessages.filter(msg => !msg.id.startsWith('temp-'))
        );
        throw error;
      }
    } catch (error) {
      console.error('Error in message handling:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add this helper function before the return statement
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach((message) => {
      if (!message.timestamp) return;
      
      const messageDate = message.timestamp;
      if (!currentDate || !isSameDay(currentDate, messageDate)) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: messageDate,
        });
      }
      groups.push({
        type: 'message',
        data: message,
      });
    });
    
    return groups;
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="h-[calc(100vh-2rem)] -mt-6 -mx-6 flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r border-primary-light/30">
          <div className="p-4 border-b border-primary-light/30">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-primary-light/10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="divide-y divide-primary-light/30 overflow-y-auto h-[calc(100vh-8rem)]">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-4 text-left hover:bg-primary-light/10 transition-all ${
                  selectedPatient?.id === patient.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {patient.displayName?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-deep-blue truncate">{patient.displayName}</h3>
                    </div>
                    <p className="text-sm text-primary-hover truncate">{patient.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedPatient ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-primary-light/30">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {selectedPatient.displayName?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-medium text-deep-blue">{selectedPatient.displayName}</h2>
                  <p className="text-xs text-primary-hover">{selectedPatient.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation by sending a message</p>
                  </div>
                </div>
              ) : (
                groupMessagesByDate(messages).map((item, index) => (
                  item.type === 'date' ? (
                    <div key={`date-${index}`} className="flex justify-center my-4">
                      <div className="bg-gray-200 rounded-full px-4 py-1">
                        <span className="text-xs text-gray-600">
                          {isToday(item.date) ? 'Today' :
                           isYesterday(item.date) ? 'Yesterday' :
                           format(item.date, 'MMMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item.data.id}
                      className={`flex ${item.data.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      {item.data.senderId !== user.uid && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-primary text-sm font-semibold">
                            {selectedPatient.displayName?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className={`max-w-[70%] ${
                        item.data.senderId === user.uid
                          ? 'bg-primary text-white'
                          : 'bg-white text-deep-blue'
                      } rounded-2xl px-4 py-2 shadow-sm`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{item.data.text}</p>
                        <p className={`text-xs mt-1 ${
                          item.data.senderId === user.uid ? 'text-white/70' : 'text-primary-hover'
                        }`}>
                          {item.data.timestamp ? format(item.data.timestamp, 'h:mm a') : 'Sending...'}
                        </p>
                      </div>
                      {item.data.senderId === user.uid && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
                          <span className="text-primary text-sm font-semibold">
                            {user.displayName?.split(' ').map(n => n[0]).join('') || 'D'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-primary-light/30">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-12 py-3 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-primary-light/10 resize-none"
                    rows="1"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button className="p-2 text-primary-hover hover:text-primary rounded-full hover:bg-primary-light/20 transition-all">
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
              <h3 className="mt-4 text-deep-blue font-medium">No chat selected</h3>
              <p className="mt-1 text-primary-hover">Select a patient to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorMessages; 