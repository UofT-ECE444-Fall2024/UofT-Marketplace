import { useEffect, useState, useCallback, useContext } from 'react';

const useMessages = (conversationId) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const socket = new WebSocket('ws://localhost:5001/ws'); // Replace with your backend URL

    // Function to fetch initial messages for the conversation
    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            const messagesWithIsMine = data.messages.map((message) => ({
                ...message,
                isMine: message.user_id === currentUser.id, // Compare the message sender's user_id with the current user's ID
            }));

            setMessages(messagesWithIsMine);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, currentUser]);

    const sendMessage = useCallback(async (text) => {
        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const newMessage = await response.json();
            const isMineMessage = {
                ...newMessage.message,
                isMine: newMessage.message.user_id === currentUser.id,
            };

            setMessages((prevMessages) => [...prevMessages, isMineMessage]);
        } catch (err) {
            setError(err.message);
        }
    }, [conversationId, currentUser]);

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('user')))
        fetchMessages();

        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            if (newMessage.conversation_id === conversationId) {
                const isMineMessage = {
                    ...newMessage,
                    isMine: newMessage.user_id === currentUser.id,
                };
                setMessages((prevMessages) => [...prevMessages, isMineMessage]);
            }
        };

        return () => {
            socket.close();
        };
    }, [fetchMessages, conversationId, currentUser, socket]);

    return { messages, isLoading, error, sendMessage };
};

export default useMessages;
