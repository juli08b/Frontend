//esto srive para crear un hook personalizado en React que permite manejar la autenticación de usuarios, incluyendo el inicio de sesión, cierre de sesión y obtención del perfil del usuario autenticado.

import { useContext } from 'react';
import { AuthContext } from './auth-context';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return context;
}
