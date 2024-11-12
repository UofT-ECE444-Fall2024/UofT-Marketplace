import React, { useEffect } from 'react';
import useGetConversations from '../hooks/useConversations';
import ConversationList from '../components/chat/ConversationsList';

const ConversationsPage = () => {
    const { conversations, loading, error } = useGetConversations(JSON.parse(localStorage.getItem('user')).id);

    if (loading) return <p>Loading conversations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 relative top-20">
            <ConversationList conversations={conversations} />
        </div>
    );
};

export default ConversationsPage;
