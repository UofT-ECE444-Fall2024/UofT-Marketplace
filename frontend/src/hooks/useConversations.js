import { useEffect, useState, useCallback } from 'react';

const useConversations = (userId) => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/conversations/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }
            
            const data = await response.json();
            setConversations(data.conversations);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return { conversations, isLoading, error, refetch: fetchConversations };
};

export default useConversations;
