import React, { useEffect, useState } from 'react';
import { fetchChatHistory, sendMessage } from '../../api/api';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChatHistory(chatId);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };

    fetchData();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(chatId, { text: newMessage, senderId: 1 }); // replace senderId with actual user ID
      setNewMessage('');
      // Refresh chat messages after sending a new message
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
