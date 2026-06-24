import { useContext } from 'react';
import RiderContext from '../context/RiderContext';

export function useRiders() {
  const context = useContext(RiderContext);
  if (!context) {
    throw new Error('useRiders must be used within a RiderProvider');
  }
  return context;
}
