import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (user?.role !== 'admin') {
    return null;
  }

  // Datos de estadísticas placeholder
  const stats = {
    totalUsers: 1234,
    activeUsers: 856,
    totalChats: 5678,
    avgResponseTime: '1.2s',
    satisfactionRate: 94.5,
    todayChats: 234
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Panel de Estadísticas</h1>
        <div className="header-right">
          <span className="admin-badge">Admin: {user.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Usuarios Totales</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🟢</div>
            <div className="stat-info">
              <h3>{stats.activeUsers.toLocaleString()}</h3>
              <p>Usuarios Activos</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3>{stats.totalChats.toLocaleString()}</h3>
              <p>Chats Totales</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <h3>{stats.avgResponseTime}</h3>
              <p>Tiempo Respuesta</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{stats.satisfactionRate}%</h3>
              <p>Satisfacción</p>
            </div>
          </div>

          <div className="stat-card primary">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.todayChats}</h3>
              <p>Chats Hoy</p>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>📈 Actividad Semanal</h3>
            <div className="chart-placeholder">
              <p>Gráfico de actividad - Próximamente</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>🥧 Distribución de Consultas</h3>
            <div className="chart-placeholder">
              <p>Gráfico circular - Próximamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
