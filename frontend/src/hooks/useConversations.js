import { useEffect, useState, useCallback } from 'react';

const useConversations = (userId) => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch conversations
    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/conversations/${userId}`);
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
        // Fetch conversations when the hook mounts
        fetchConversations();
    }, [fetchConversations]);

    return { conversations, isLoading, error, refetch: fetchConversations };
};

export default useConversations;