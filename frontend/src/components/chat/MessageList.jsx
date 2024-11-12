import React, { useState, useEffect, useRef } from 'react';
import WriteRating from '../ratings/WriteRating';

const MessageList = ({ messages, convoId, userId }) => {
    const messagesEndRef = useRef(null);
    const [sellerUsername, setSellerUsername] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [itemStatus, setItemStatus] = useState("Available");

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [messages]);

    useEffect(() => {
        // Fetch seller details using the convoId
        const fetchSellerDetails = async () => {
            try {
                const response = await fetch(`/api/conversations/${convoId}/seller`);
                const data = await response.json();
                setSellerUsername(data.username);
                setSellerName(data.fullname);
                setItemStatus(data.item_status);
            } catch (error) {
                console.error("Failed to fetch seller details:", error);
            }
        };

        fetchSellerDetails();
    }, [convoId]);

    return (
        <div className="message-list p-4 overflow-y-auto space-y-2 relative bottom-20 mt-40">
            {(userId != sellerUsername) && (itemStatus != "Available") ? <WriteRating username={sellerUsername} fullname={sellerName}/> : "" }
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
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
