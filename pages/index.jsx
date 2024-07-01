import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Menu from './components/Menu/Menu';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

let socket;

const Home = () => {
    // Estado para controlar a sala atual, ID da sala e mensagens
    const [currentRoom, setCurrentRoom] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [owner, setOwner] = useState(null);

    // Efeito para inicializar o socket e adicionar listeners
    useEffect(() => {
        socket = io();

        // Listener para mensagens recebidas
        socket.on('message', (messages) => {
            setMessages(() => messages);
        });

        socket.on('roomCreated', (roomId) => {
            socket.emit('joinRoom', roomId);
            setCurrentRoom(roomId);
        });

        socket.on('roomJoined', (roomData) => {
            setOwner(roomData.owner);
            setCurrentRoom(roomData.roomId);
            setUsers(roomData.users);
        });

        socket.on('room404', (roomId) => {
            setCurrentRoom(null);
            alert(`Room ${roomId} not found`);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    // Função para criar uma nova sala
    const createRoom = () => {
        socket.emit('createRoom');
    };

    // Função para entrar em uma sala existente
    const joinRoom = () => {
        socket.emit('joinRoom', roomId);
    };

    // Função para sair da sala atual
    const leaveRoom = () => {
        socket.emit('leaveRoom', currentRoom);
        setCurrentRoom(null);
        setMessages([]);
    };

    // Função para enviar uma mensagem
    const sendMessage = () => {
        socket.emit('message', { roomId: currentRoom, message });
        setMessage('');
    };

    return (
        <Container fluid>
            <Row>
                <Col md={3} style={{ padding: '0px' }}>
                    <Menu />
                </Col>
                <Col md={9}>
                    <h1 style={{ textAlign: 'center', width: '100%', height: '10%' }}>Chat App</h1>
                    <div className="chat-container">
                        {!currentRoom && (
                            <div>
                                <h2>Choose or Create a Room</h2>
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Room ID"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="button-panel">
                                        <Button onClick={joinRoom}>Join Room</Button>
                                        <Button onClick={createRoom}>Create Room</Button>
                                    </div>
                                </Form>
                            </div>
                        )}
                        {currentRoom && (
                            <div className='room-messages'>
                                <Row>
                                    <Col md={12} style={{ textAlign: 'center' }}>
                                        <h2>Room: {currentRoom}</h2>
                                        <p>Owner: {owner}</p>
                                    </Col>
                                </Row>
                                <div className="message-panel">
                                    <div className="message-container">
                                        <div style={{ overflowY: 'auto', border: '1px solid #ccc', padding: '10px', height: '90%' }}>
                                            {messages.map((message, index) => (
                                                <div key={index}>{index}: {message}</div>
                                            ))}
                                        </div>
                                        <Form style={{ height: '10%' }}>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Message"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    <div className="button-panel">
                                        <Button onClick={sendMessage}>Send Message</Button>
                                        <Button onClick={leaveRoom}>Leave Room</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );



};

export default Home;
