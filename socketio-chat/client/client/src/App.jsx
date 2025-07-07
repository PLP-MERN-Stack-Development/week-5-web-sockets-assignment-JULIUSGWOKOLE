import { useEffect, useState } from 'react';
import { socket, connectSocket, disconnectSocket } from './services/socket';

function App() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    connectSocket();

    // Set up all event listeners
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('usersUpdate', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('userTyping', ({ username, isTyping }) => {
      setTypingUsers(prev => 
        isTyping 
          ? [...prev.filter(u => u !== username), username]
          : prev.filter(u => u !== username)
      );
    });

    return () => {
      // Clean up on unmount
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('usersUpdate');
      socket.off('userTyping');
      disconnectSocket();
    };
  }, []);

  const sendMessage = (content) => {
    socket.emit('sendMessage', { content });
  };

  return (
    <div className="chat-app">
      {/* Your chat UI components here */}
    </div>
  );
}

export default App;