import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [messages]);

    return (
        <div className="message-list p-4 overflow-y-auto space-y-2 relative bottom-20 mt-40">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-start' : 'justify-end'}`}
                >
                    <div
                        className={`message-item max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                            message.isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                        }`}
                    >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
                    </div>
                    
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
