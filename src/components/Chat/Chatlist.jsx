import React, { useEffect, useState } from 'react';
import { fetchChats, createChat, searchProfiles, fetchSelfProfile } from '../../api/api';
import './ChatList.css';
import ChatWindow from './ChatWindow.jsx';

import chatIcon from '../../assets/chat.svg';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [newChatName, setNewChatName] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCurrentUser();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchChats();
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchSelfProfile();
      setCurrentUser(response.data.response);
    } catch (error) {
      console.error('Failed to fetch current user', error);
    }
  };

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchProfiles(query);
      setSearchResults(response.data.profiles);
    } catch (error) {
      console.error('Failed to search profiles', error);
    }
  };

  const handleCreateChat = async () => {
    if (newChatName.trim() === '') {
      console.error('Название чата не может быть пустым');
      return;
    }
    if (selectedUsers.length === 0) {
      console.error('Необходимо выбрать хотя бы одного пользователя');
      return;
    }

    try {
      const response = await createChat({ name: newChatName, members: selectedUsers.map(user => user.username) });
      const newChat = response.data;
      setChats(prevChats => [...prevChats, newChat]);
      setNewChatName('');
      setSelectedUsers([]);
      setIsAddChatModalOpen(false);
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  const handleUserSelect = (user) => {
    if (currentUser && user.username === currentUser.username) {
      return;
    }

    const isSelected = selectedUsers.some(selectedUser => selectedUser.username === user.username);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(u => u.username !== user.username));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const openChatWindow = (chatId) => {
    setSelectedChatId(chatId);
    setIsChatWindowOpen(true);
  };

  const closeChatWindow = () => {
    setIsChatWindowOpen(false);
    setSelectedChatId(null);
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      <button onClick={() => setIsAddChatModalOpen(true)} className="add-chat-button"></button>

      {isAddChatModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddChatModalOpen(false)}>&times;</span>
            <input
              type="text"
              placeholder="Введите название чата"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="chat-input"
            />
            <input
              type="text"
              placeholder="Введите имя пользователя для поиска"
              value={userSearchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="user-input"
            />
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map(user => (
                  user.username !== currentUser.username && (
                    <div
                      key={user.username}
                      onClick={() => handleUserSelect(user)}
                      className={`search-result-item ${selectedUsers.some(selectedUser => selectedUser.username === user.username) ? 'selected' : ''}`}
                    >
                      {user.username} - {user.name}
                    </div>
                  )
                ))
              ) : (
                <div>Нет результатов</div>
              )}
            </div>
            <div className="selected-users">
              <h4>Выбранные пользователи:</h4>
              {selectedUsers.length > 0 ? (
                selectedUsers.map(user => (
                  <div
                    key={user.username}
                    className="selected-user-item"
                    onClick={() => handleUserSelect(user)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.username} - {user.name}
                  </div>
                ))
              ) : (
                <div>Нет выбранных пользователей</div>
              )}
            </div>
            <button onClick={handleCreateChat} className="create-chat-button" disabled={!newChatName.trim() || selectedUsers.length === 0}>Создать чат</button>
          </div>
        </div>
      )}

      {isChatWindowOpen && selectedChatId !== null && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeChatWindow}>&times;</span>
            <ChatWindow chatId={selectedChatId} />
          </div>
        </div>
      )}
      
      {/* Поиск чатов */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск чатов..."
          value={chatSearchQuery}
          onChange={(e) => setChatSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="chat-list-wrapper">
        <div className="chat-list">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div key={chat.id} className="chat-item" onClick={() => openChatWindow(chat.id)}>
                <div className="chat-info">
                  <img src={chatIcon} alt="Chat Icon" className="chat-icon" /> 
                  <div className="chat-name">{chat.name}</div>
                  <div className="last-message">{chat.lastMessage}</div>
                  <div className="chat-meta">
                    <span className="chat-time">{chat.lastMessageTime}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Чаты не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
