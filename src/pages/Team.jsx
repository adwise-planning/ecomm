import React from 'react';
import { useAuth } from '../context/AuthContext';
import L3TeamView from './team/L3TeamView.jsx';

const Team = () => {
  const { user } = useAuth();

  switch (user.role) {
    case 'L1':
      // Placeholder for L1 Team View
      return <div>L1 Team Management</div>;
    case 'L3':
      return <L3TeamView />;
    default:
      return <div>No team management available for your role.</div>;
  }
};

export default Team;
