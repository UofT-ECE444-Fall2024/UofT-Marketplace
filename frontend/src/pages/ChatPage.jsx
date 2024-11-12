import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatSocket } from '../hooks/useChatSocket';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';

const ChatPage = () => {
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const { conversationId } = useParams();
  const { messages, sendMessage, joined } = useChatSocket(conversationId, userId);



  return (
    <div className="chat-page">
      <div className="chat-body">
        <MessageList messages={messages} />
      </div>

      <MessageInput onSendMessage={sendMessage} userId={userId} />

    </div>
  );
};

export default ChatPage;
