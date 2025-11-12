'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const EditModeContext = createContext({
  isEditMode: false,
  toggleEditMode: () => {},
  isAdmin: false,
});

export const EditModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAdmin } = useAuth(); // Usar el hook de autenticación real

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, isAdmin }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => useContext(EditModeContext);
