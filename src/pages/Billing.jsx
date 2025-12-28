import React from 'react';
import { useAuth } from '../context/AuthContext';
import L3BillingView from '/src/views/L3BillingView.jsx';

const Billing = () => {
  const { user } = useAuth();

  // For now, we only have an L3 view.
  // We can add L1/L2/L4 views here later if needed.
  if (user.role === 'L3' || user.role === 'L1') {
    return <L3BillingView />;
  }

  return <div>No billing information available for your role.</div>;
};

export default Billing;
