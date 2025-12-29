import React, { useState } from 'react';

export const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <div onMouseEnter={() => setIsOpen(true)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50">
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ icon, label, onClick }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full"
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
};
