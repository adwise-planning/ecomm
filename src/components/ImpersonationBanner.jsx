import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserX } from 'lucide-react';

const ImpersonationBanner = () => {
  const { isImpersonating, originalUser, stopImpersonation } = useAuth();

  if (!isImpersonating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2 text-white bg-yellow-500">
      <p className="text-sm">
        You are currently impersonating{' '}
        <span className="font-bold">{originalUser?.name}</span>.
      </p>
      <button
        onClick={stopImpersonation}
        className="flex items-center gap-2 ml-4 px-3 py-1 text-sm text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
      >
        <UserX size={14} />
        Stop Impersonating
      </button>
    </div>
  );
};

export default ImpersonationBanner;
