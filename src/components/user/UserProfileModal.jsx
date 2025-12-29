import React from 'react';

const UserProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        {/* Placeholder for profile content */}
        <p>User details will be displayed here.</p>
        <button onClick={onClose} className="mt-4 bg-primary text-white py-2 px-4 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;
