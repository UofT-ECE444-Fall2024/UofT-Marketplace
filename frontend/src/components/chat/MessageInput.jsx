import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, userId }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message, userId);
            setMessage('');  // Clear the input after sending
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {  // Send message on Enter without Shift
            e.preventDefault();  // Prevents newline in the input
            handleSend();
        }
    };

    return (
        <div className="message-input flex items-center p-4 border-t w-full fixed bottom-0 bg-white">
            <textarea
                className="flex-grow p-2 border rounded-lg outline-none resize-none"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}  // Keeps it as a single-line input
            />
            <button
                onClick={handleSend}
                className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;