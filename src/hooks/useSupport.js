import { useContext } from 'react';
import SupportContext from '../context/SupportContext';

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}
