import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import agentService from '../services/agentService';
import './Chat.css';

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'system' }>>([
    { id: 1, text: '¡Bienvenido al chat! ¿En qué puedo ayudarte con tus finanzas?', sender: 'system' }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await agentService.sendMessage(message);
      
      const agentResponse = {
        id: Date.now(),
        text: response.agentResponse || 'No pude procesar tu solicitud.',
        sender: 'system' as const
      };
      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: error instanceof Error ? error.message : 'Error al conectar con el agente.',
        sender: 'system' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'user') {
    return null;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <h1>Chat</h1>
          <p className="user-info">{user.name} ({user.email})</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
      
      <div className="chat-content">
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-system'}`}>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
