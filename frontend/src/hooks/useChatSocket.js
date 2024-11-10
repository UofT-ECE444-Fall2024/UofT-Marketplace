import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const useChatSocket = (conversationId, userId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    if (conversationId) {
      newSocket.emit('join_conversation', { conversation_id: conversationId, user_id: userId });

      newSocket.on('joined', (data) => {
        setJoined(true);
        if (data.messages !== undefined) {
            setMessages(data.messages.map(message => {
                console.log(message)
                return {
                    ...message,
                    isMine: message.sender.id === userId
                };
            }))
        }
        console.log("Joined " + data.messages);
    });
      newSocket.on('receive_message', (newMessage) => {
        newMessage.isMine = newMessage.sender.id === userId
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        newSocket.emit('leave', { conversationId });
        newSocket.disconnect();
      };
    }
  }, [conversationId]);

  const sendMessage = (content, userId) => {
    if (socket) {
        socket.emit('send_message', { conversation_id: conversationId, content, user_id: userId });
    }
  };

  return { messages, sendMessage, joined };
};