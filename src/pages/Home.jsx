import React from 'react';
import ChatList from '/home/dev/Рабочий стол/Messanger/my-messenger/src/components/Chat/Chatlist.jsx';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Чаты</h1>
      <ChatList />
    </div>
  );
};

export default Home;
