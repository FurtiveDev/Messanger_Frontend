import React from 'react';

const Message = ({ message }) => {
  return (
    <div>
      <span>{message.senderId}</span>
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
