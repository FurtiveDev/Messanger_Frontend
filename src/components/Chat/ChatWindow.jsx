import React, { useEffect, useState } from 'react';
import { fetchChatHistory, sendMessage } from '../../api/api';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChatHistory(chatId);
        setMessages(response.data.chats);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };

    fetchData();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!newMessage.trim()) {
        return;
      }
      await sendMessage(chatId, newMessage);
      setNewMessage('');
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
