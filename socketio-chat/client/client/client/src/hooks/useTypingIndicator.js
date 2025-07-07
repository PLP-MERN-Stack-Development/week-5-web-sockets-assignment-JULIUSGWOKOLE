import { useEffect } from 'react';
import { socket } from '../services/socket';

export const useTypingIndicator = () => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef();

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('typing', true);
      setIsTyping(true);
    }
    
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing', false);
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    return () => clearTimeout(typingTimeout.current);
  }, []);

  return handleTyping;
};
