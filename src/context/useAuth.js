import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
//import { useAuth } from '../context/useAuth';  To use the login context, you must import it