import React, { useEffect, useState } from 'react';
import { fetchChats, createChat } from '../../api/api';
import './ChatList.css';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [newChatName, setNewChatName] = useState('');
  const [userName, setUserName] = useState('');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchChats();
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await createChat({ name: newChatName, userName });
      const newChat = response.data;
      setChats(prevChats => [...prevChats, newChat]);
      setNewChatName('');
      setUserName(''); 
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  return (
    <div className="chat-list-container">
      <div className="create-chat">
        <input
          type="text"
          placeholder="Введите название чата"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          className="chat-input"
        />
        <input
          type="text"
          placeholder="Введите ваше имя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="user-input"
        />
        <button onClick={handleCreateChat} className="create-chat-button">
          Создать чат
        </button>
      </div>
      {chats.map(chat => (
        <div key={chat.id} className="chat-item">
          <div className="chat-info">
            <div className="chat-name">{chat.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
