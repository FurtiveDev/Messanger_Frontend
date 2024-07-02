import React, { useEffect, useState } from 'react';
import { fetchChatHistory, sendMessage as apiSendMessage } from '../../api/api';
import { Centrifuge } from 'centrifuge';

const CHAT_API_URL = 'http://localhost:8000/chats/';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [centrifuge, setCentrifuge] = useState(null);

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
          setMessages(prevMessages => [...prevMessages, ctx.data]);
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

  return (
    <div>
      <div>
      {messages.map(message => {
          console.log(message);
          return <div key={message.id}>{message.text}</div>;
        })}

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
