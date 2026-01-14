import { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';

import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { UserControls } from './components/UserControls';
import { ChatHeader } from './components/ChatHeader';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('anonymousChatUserId');
    return storedUserId || nanoid(); // Исправлено
  });

  const [impersonateId, setImpersonateId] = useState('');
  
  const lastMessageIdRef = useRef(() => {
    return Number(localStorage.getItem('lastMessageId')) || 0; // Исправлено
  });
  
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('anonymousChatUserId', userId);
  }, [userId]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:7070/messages?from=${lastMessageIdRef.current}`); // Исправлено

      if (!response.ok) throw new Error('Network response was not ok');
      
      const newMessages = await response.json();
      if (newMessages.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
          
          if (filteredNew.length > 0) {
            lastMessageIdRef.current = filteredNew[filteredNew.length - 1].id;
            localStorage.setItem('lastMessageId', lastMessageIdRef.current);
            return [...prev, ...filteredNew];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Trying again...');
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return; // Исправлено
    
    setIsSending(true);
    setError(null);
    
    try {
      const currentUserId = impersonateId || userId; // Исправлено
      
      const response = await fetch('http://localhost:7070/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0,
          userId: currentUserId,
          content: inputValue.trim(),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send message');

      setInputValue('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    pollingIntervalRef.current = setInterval(fetchMessages, 2000);
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchMessages]);

  const handleImpersonate = () => {
    if (impersonateId) {
      setUserId(impersonateId);
      setImpersonateId('');
    }
  };

  return (
    <div className="chat-container">
      <ChatHeader />
      
      <UserControls
        userId={userId}
        impersonateId={impersonateId}
        setImpersonateId={setImpersonateId}
        handleImpersonate={handleImpersonate}
      />
      
      <ErrorMessage 
        error={error} 
        onDismiss={() => setError(null)} 
      />
      
      <MessageList messages={messages} userId={userId} />
      
      <MessageInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isSending={isSending}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;