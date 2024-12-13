import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Updated import
import socket from '../../socket/socket';

const rooms = {};

const ChatPage= () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Updated

  const generateUniqueCode = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter a name.');
      return;
    }
  
    if (!code || !rooms[code]) {
      setError('Please enter a valid room code.');
      return;
    }
  
    // Emit join event to the server
    socket.emit('joinRoom', { code, name });
  
    // Listen for error messages from the server
    socket.on('message', (data) => {
      if (data.message === "Room does not exist.") {
        setError("Room does not exist. Please check the code.");
      } else {
        // Navigate to the chat room on successful join
        navigate(`/chat/${code}`);
      }
    });
  };
  

  const handleCreateRoom = () => {
    if (!name) {
      setError('Please enter a name.');
      return;
    }
  
    const roomCode = generateUniqueCode(4);
    
    // Emit room creation event to the server
    socket.emit('createRoom', { code: roomCode, name });
  
    // Navigate to the chat room
    navigate(`/chat/${roomCode}`);
  };
  
  return (
    <div>
      <form>
        <h3>Enter The Chat Room</h3>
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Pick a name!"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Room Code:</label>
          <input
            type="text"
            placeholder="Room Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleJoinRoom}>Join Room</button>
        <button
          type="button"
          onClick={handleCreateRoom}  
        >
          Create Room
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default ChatPage;
