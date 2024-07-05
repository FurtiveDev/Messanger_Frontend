import React, { useEffect, useState } from 'react';
import {
  fetchChatHistory,
  sendMessage as apiSendMessage,
  deleteMessage as apiDeleteMessage,
  updateMessage as apiUpdateMessage,
  fetchChatMembers,
} from '../../api/api';
import { Centrifuge } from 'centrifuge';
import ChatInfoModal from './ChatInfoModal'; // Adjust import path as per your file structure

const CHAT_API_URL = 'http://localhost:8000/chats/';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [centrifuge, setCentrifuge] = useState(null);
  const [chatInfo, setChatInfo] = useState(null); // состояние для хранения информации о чате
  const [showModal, setShowModal] = useState(false); // состояние для отображения модального окна

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChatHistory(chatId);
        if (response.data && response.data.chats) {
          setMessages(response.data.chats);
          setChatInfo(response.data); // сохраняем информацию о чате
        } else {
          setMessages([]);
          setChatInfo(null);
        }
      } catch (error) {
        console.error('Failed to fetch chat history', error);
        setMessages([]);
        setChatInfo(null);
      }
    };

    if (chatId) {
      fetchData();
    }
  }, [chatId]);

  useEffect(() => {
    const initCentrifuge = async () => {
      try {
        const response = await fetch(CHAT_API_URL + 'get-cent-token', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const centrifugoData = await response.json();

        const centrifugeInstance = new Centrifuge(centrifugoData.url, {
          token: centrifugoData.token
        });

        centrifugeInstance.on('connecting', function (ctx) {
          console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
        }).on('connected', function (ctx) {
          console.log(`connected over ${ctx.transport}`);
        }).on('disconnected', function (ctx) {
          console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
        });

        centrifugeInstance.connect();

        const sub = centrifugeInstance.newSubscription(`${chatId}`);

        sub.on('publication', function (ctx) {
          if (ctx.data && ctx.data.type) {
            const { type, data } = ctx.data;
            if (type === 'send_message') {
              setMessages(prevMessages => [...prevMessages, data]);
              updateChatInfo();
            } else if (type === 'edit_message') {
              setMessages(prevMessages => prevMessages.map(msg => msg.id === data.id ? { ...msg, text: data.text } : msg));
              updateChatInfo();
            } else if (type === 'delete_message') {
              setMessages(prevMessages => prevMessages.filter(msg => msg.id !== data.messageId));
              updateChatInfo();
            }
          }
        });

        sub.subscribe();

        setCentrifuge(centrifugeInstance);
      } catch (error) {
        console.error('Failed to initialize Centrifugo', error);
      }
    };

    if (chatId) {
      initCentrifuge();
    }

    return () => {
      if (centrifuge) {
        centrifuge.disconnect();
      }
    };
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!newMessage.trim()) {
        return;
      }
      await apiSendMessage(chatId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiDeleteMessage(chatId, messageId);
      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();
    try {
      if (!editMessageText.trim()) {
        return;
      }
      await apiUpdateMessage(chatId, editMessageId, { text: editMessageText });
      setMessages(prevMessages => prevMessages.map(message =>
        message.id === editMessageId ? { ...message, text: editMessageText } : message
      ));
      setEditMessageId(null);
      setEditMessageText('');
    } catch (error) {
      console.error('Failed to update message', error);
    }
  };

  const startEditingMessage = (message) => {
    setEditMessageId(message.id);
    setEditMessageText(message.text);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateChatInfo = async () => {
    try {
      const response = await fetchChatHistory(chatId);
      if (response.data) {
        setChatInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to update chat info', error);
    }
  };

  return (
    <div>
      {/* Название группы и кнопка для отображения модального окна */}
      {chatInfo && (
        <div>
          <h3>{chatInfo.chat_name}</h3>
          <button onClick={openModal}>
            Chat Info
          </button>
        </div>
      )}

      <div>
        {messages && messages.map(message => (
          <div key={message.id}>
            {message.text}
            <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            <button onClick={() => startEditingMessage(message)}>Edit</button>
          </div>
        ))}
      </div>
      {editMessageId !== null && (
        <form onSubmit={handleEditMessage}>
          <input
            type="text"
            value={editMessageText}
            onChange={(e) => setEditMessageText(e.target.value)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => { setEditMessageId(null); setEditMessageText(''); }}>Cancel</button>
        </form>
      )}
      {editMessageId === null && (
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      )}

      {/* Модальное окно для отображения информации о чате */}
      {showModal && (
        <ChatInfoModal
          chatId={chatId}
          chatInfo={chatInfo}
          onDeleteMember={(username) => {
            updateChatInfo();
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ChatWindow;
