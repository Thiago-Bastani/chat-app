import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);
      alert(`Room created with ID: ${roomId}`);
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    socket.emit('joinRoom', roomId);
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', roomId);
  };

  const sendMessage = () => {
    socket.emit('message', { roomId, message });
    setMessage('');
  };

  return (
    <div>
      <h1>Chat App</h1>
      <button onClick={createRoom}>Create Room</button>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={leaveRoom}>Leave Room</button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
