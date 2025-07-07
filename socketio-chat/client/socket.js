import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' 
  ? window.location.hostname 
  : 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    username: localStorage.getItem('username') || prompt('Enter your username:')
  }
});

// Connection management
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
