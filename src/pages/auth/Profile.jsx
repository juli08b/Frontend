// esto sirve para crear un componente de perfil de usuario en React, donde se muestra la información del usuario autenticado y el número de aprendices registrados en la plataforma.

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { API_URL, formatDate } from '../../utils/helpers';

export default function Profile() {
  const { user } = useAuth();
  const [apprenticesCount, setApprenticesCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadCount() {
      try {
        const res = await fetch(`${API_URL}/apprentices`);
        const data = await res.json();
        if (active) setApprenticesCount(data.length);
      } catch {
        // Ignorar si no se puede consultar
      }
    }
    loadCount();
    return () => {
      active = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <div className="empty-state">
          No hay información de sesión disponible.
        </div>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="page-container">
      <div className="card profile-card">
        <div className="profile-avatar">{initial}</div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        <div className="card-details">
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Correo electrónico:</strong> {user.email}
          </p>
          <p>
            <strong>ID de usuario:</strong> {user.id}
          </p>
          <p>
            <strong>Miembro desde:</strong> {formatDate(user.createdAt)}
          </p>
          <p>
            <strong>Aprendices registrados:</strong> {apprenticesCount}
          </p>
        </div>
      </div>
    </div>
  );
}
