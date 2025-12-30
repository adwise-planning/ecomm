import React, { useState, useRef, useEffect, Children, cloneElement } from 'react';

export const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();

  const handleClickOutside = e => {
    if (node.current && !node.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
      setIsOpen(false);
  }

  return (
    <div className="relative" ref={node}>
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50"
          onClick={handleClose}
        >
          {Children.map(children, child =>
             cloneElement(child, { onClick: () => {
                if (child.props.onClick) {
                    child.props.onClick();
                }
                handleClose();
             }})
          )}
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
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
};
