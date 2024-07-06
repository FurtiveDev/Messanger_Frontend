import React, { useEffect, useState } from 'react';
import { fetchChatMembers, deleteChatMember, addChatMember, searchProfiles } from '../../api/api';
import './ChatInfoModal.css'; // Импорт CSS файла для стилей

const ChatInfoModal = ({ chatId, chatInfo, onDeleteMember, onClose }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetchChatMembers(chatId);
        if (response.data) {
          setMembers(response.data.members);
        }
      } catch (error) {
        console.error('Failed to fetch chat members', error);
      }
    };

    if (chatId) {
      fetchMembers();
    }
  }, [chatId]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchProfiles(query);
      const filteredResults = response.data.profiles.filter(profile => !members.some(member => member.username === profile.username));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Failed to search profiles', error);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      console.error('Необходимо выбрать хотя бы одного пользователя');
      return;
    }

    try {
      await addChatMember(chatId, { members: selectedUsers.map(user => user.username) });
      setMembers(prevMembers => [...prevMembers, ...selectedUsers]);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to add chat members', error);
    }
  };

  const handleSelectUser = (user) => {
    const alreadySelected = selectedUsers.some(selectedUser => selectedUser.username === user.username);

    if (alreadySelected) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDeleteMember = async (username) => {
    try {
      await deleteChatMember(chatId, username);
      setMembers(prevMembers => prevMembers.filter(member => member.username !== username));
      onDeleteMember(username);
    } catch (error) {
      console.error('Failed to delete chat member', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Информация о чате</h2>
        {chatInfo && (
          <div>
            <h3>{chatInfo.chat_name}</h3>
            <h4>Участники:</h4>
            <ul>
              {members.map(member => (
                <li key={member.username}>
                  {member.username} - {member.name}
                  <button className="remove-btn" onClick={() => handleDeleteMember(member.username)}>×</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <input
          type="text"
          placeholder="Поиск по имени пользователя"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(user => (
              <div
                key={user.username}
                onClick={() => handleSelectUser(user)}
                className={`search-result-item ${selectedUsers.some(selectedUser => selectedUser.username === user.username) ? 'selected' : ''}`}
              >
                {user.username} - {user.name}
              </div>
            ))
          ) : (
            <div>Ничего не найдено</div>
          )}
        </div>
        <button className="add-members-btn" onClick={handleAddMembers} disabled={selectedUsers.length === 0}>Добавить пользователя</button>
      </div>
    </div>
  );
};

export default ChatInfoModal;
