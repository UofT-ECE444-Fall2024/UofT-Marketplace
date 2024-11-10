import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationList = ({ conversations }) => {
    const navigate = useNavigate();
    const handleOpenChat = (conversation_id) => {
        navigate(`/chat/${conversation_id}`);
    }

    if (!conversations || conversations.length === 0) {
        return <p>No conversations available.</p>;
    }

    return (
        <div className="space-y-4">
            {conversations.map(conversation => (
                <div 
                    key={conversation.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenChat(conversation.id)}
                >
                    <h2 className="text-lg font-semibold">
                        {conversation.item.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                        Last message: {conversation.last_message || 'No messages yet'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {conversation.last_message_timestamp 
                            ? new Date(conversation.last_message_timestamp).toLocaleString()
                            : 'N/A'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;