import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user from localStorage
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password, role = 'customer') => {
    // Simulate API call dengan data mock
    let mockUser;
    
    if (role === 'admin') {
      // Admin credentials
      mockUser = {
        id: 1, // Admin id selalu 1
        email,
        name: "Admin User",
        role: 'admin',
        token: 'mock-jwt-token-admin'
      };
    } else {
      // Customer credentials
      mockUser = {
        id: 2, // Customer id selalu 2
        email,
        name: email.split('@')[0],
        role: 'customer',
        token: 'mock-jwt-token-customer'
      };
    }

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));

    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};