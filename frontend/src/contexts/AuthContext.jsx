import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data.user))
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (email, password, firstName, lastName, role = 'sales_rep') => {
    const res = await api.post('/auth/register', { 
      email, 
      password, 
      first_name: firstName, 
      last_name: lastName, 
      role 
    });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}