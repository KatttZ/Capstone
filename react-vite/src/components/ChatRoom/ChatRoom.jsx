import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import socket from '../../socket/socket';
import './ChatRoom.css';

const ChatRoom = () => {
  const { roomCode } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    socket.emit('joinRoom', { code: roomCode, name: user.username });
  
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    return () => {
      socket.emit('leaveRoom', { code: roomCode, name: user.username });
      socket.off('message');
    };
  }, [roomCode, user.username]);
  
  
  

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    console.log('Sending message:', message);
    socket.emit('message', {
      room: roomCode,
      name: user.username, // You might replace 'User' with a dynamic username
      message,
    });
  
    // Optionally, append the message to the local state immediately
    setMessages((prevMessages) => [...prevMessages, { name: user.username, message }]);
  
    setMessage('');
  };
  

  return (
    <div>
      <h1>Chat Room: {roomCode}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.name}:</strong> {msg.message}
          </div>
        ))}
      </div>

    
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;